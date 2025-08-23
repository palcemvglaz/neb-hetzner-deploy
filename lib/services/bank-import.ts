import * as XLSX from 'xlsx'
import { prisma } from '@/lib/db/prisma'
import { DuplicateDetectionService } from './duplicate-detection'

export interface BankTransaction {
  date: Date
  description: string
  amount: number
  currency: string
  type: 'debit' | 'credit'
  reference?: string
  category?: string
  balance?: number
}

export interface ImportResult {
  total: number
  imported: number
  duplicates: number
  errors: number
  transactions: BankTransaction[]
}

export class BankImportService {
  /**
   * Parse Excel file and extract transactions
   */
  static async parseExcelFile(buffer: Buffer): Promise<BankTransaction[]> {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
    
    // Log first few rows to understand structure
    console.log('First 3 rows:', jsonData.slice(0, 3))
    
    // Map to our transaction format
    const transactions: BankTransaction[] = []
    
    for (const row of jsonData) {
      try {
        const transaction = this.mapRowToTransaction(row)
        if (transaction) {
          transactions.push(transaction)
        }
      } catch (error) {
        console.error('Error parsing row:', row, error)
      }
    }
    
    return transactions
  }

  /**
   * Map Excel row to transaction object
   * This needs to be customized based on bank format
   */
  private static mapRowToTransaction(row: any): BankTransaction | null {
    // Common column names in Ukrainian bank statements
    const dateKeys = ['Дата', 'Date', 'Дата операції', 'Transaction Date']
    const descKeys = ['Опис', 'Description', 'Призначення платежу', 'Details']
    const amountKeys = ['Сума', 'Amount', 'Сума операції', 'Transaction Amount']
    const currencyKeys = ['Валюта', 'Currency', 'Валюта операції']
    const balanceKeys = ['Залишок', 'Balance', 'Баланс після операції']
    
    // Find date
    let date: Date | null = null
    for (const key of dateKeys) {
      if (row[key]) {
        date = this.parseDate(row[key])
        if (date) break
      }
    }
    
    if (!date) return null
    
    // Find description
    let description = ''
    for (const key of descKeys) {
      if (row[key]) {
        description = String(row[key])
        break
      }
    }
    
    // Find amount
    let amount = 0
    let type: 'debit' | 'credit' = 'debit'
    for (const key of amountKeys) {
      if (row[key] !== undefined) {
        const val = this.parseAmount(row[key])
        if (val !== null) {
          amount = Math.abs(val)
          type = val >= 0 ? 'credit' : 'debit'
          break
        }
      }
    }
    
    // Find currency
    let currency = 'UAH'
    for (const key of currencyKeys) {
      if (row[key]) {
        currency = String(row[key]).toUpperCase()
        break
      }
    }
    
    // Find balance
    let balance: number | undefined
    for (const key of balanceKeys) {
      if (row[key]) {
        const val = this.parseAmount(row[key])
        if (val !== null) {
          balance = val
          break
        }
      }
    }
    
    return {
      date,
      description,
      amount,
      currency,
      type,
      balance
    }
  }

  /**
   * Parse various date formats
   */
  private static parseDate(value: any): Date | null {
    if (!value) return null
    
    // If it's already a Date
    if (value instanceof Date) return value
    
    // Excel serial date
    if (typeof value === 'number') {
      return new Date((value - 25569) * 86400 * 1000)
    }
    
    // String date
    const dateStr = String(value)
    
    // Try different formats
    const formats = [
      /(\d{2})\.(\d{2})\.(\d{4})/, // DD.MM.YYYY
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
    ]
    
    for (const format of formats) {
      const match = dateStr.match(format)
      if (match) {
        if (format === formats[0] || format === formats[2]) {
          // DD.MM.YYYY or DD/MM/YYYY
          return new Date(`${match[3]}-${match[2]}-${match[1]}`)
        } else {
          // YYYY-MM-DD
          return new Date(dateStr)
        }
      }
    }
    
    // Try native parse as last resort
    const parsed = new Date(dateStr)
    return isNaN(parsed.getTime()) ? null : parsed
  }

  /**
   * Parse amount from various formats
   */
  private static parseAmount(value: any): number | null {
    if (value === null || value === undefined) return null
    
    // If it's already a number
    if (typeof value === 'number') return value
    
    // Convert to string and clean
    let amountStr = String(value)
      .replace(/\s/g, '') // Remove spaces
      .replace(',', '.') // Replace comma with dot
      .replace(/[^\d.-]/g, '') // Keep only digits, dots, and minus
    
    const amount = parseFloat(amountStr)
    return isNaN(amount) ? null : amount
  }

  /**
   * Import transactions to database
   */
  static async importTransactions(
    transactions: BankTransaction[],
    userId: string
  ): Promise<ImportResult> {
    let imported = 0
    let duplicates = 0
    let errors = 0
    
    for (const transaction of transactions) {
      try {
        // Create payment record
        const payment = await prisma.payment.create({
          data: {
            amount: transaction.amount,
            currency: transaction.currency,
            status: 'COMPLETED',
            type: 'ONE_TIME',
            provider: 'BANK_IMPORT' as any, // We'll need to add this to the enum
            userId,
            metadata: {
              description: transaction.description,
              importedAt: new Date().toISOString(),
              balance: transaction.balance,
              type: transaction.type
            }
          }
        })
        
        // Check for duplicates
        const duplicate = await DuplicateDetectionService.checkNewPayment(payment)
        if (duplicate) {
          await DuplicateDetectionService.markAsDuplicate(payment.id, duplicate.original.id)
          duplicates++
        } else {
          imported++
        }
      } catch (error) {
        console.error('Error importing transaction:', error)
        errors++
      }
    }
    
    return {
      total: transactions.length,
      imported,
      duplicates,
      errors,
      transactions
    }
  }

  /**
   * Preview transactions before import
   */
  static async previewFile(buffer: Buffer): Promise<{
    transactions: BankTransaction[]
    summary: {
      total: number
      totalCredit: number
      totalDebit: number
      dateRange: { from: Date, to: Date }
      currencies: string[]
    }
  }> {
    const transactions = await this.parseExcelFile(buffer)
    
    const credits = transactions.filter(t => t.type === 'credit')
    const debits = transactions.filter(t => t.type === 'debit')
    const dates = transactions.map(t => t.date).sort((a, b) => a.getTime() - b.getTime())
    const currencies = [...new Set(transactions.map(t => t.currency))]
    
    return {
      transactions: transactions.slice(0, 10), // First 10 for preview
      summary: {
        total: transactions.length,
        totalCredit: credits.reduce((sum, t) => sum + t.amount, 0),
        totalDebit: debits.reduce((sum, t) => sum + t.amount, 0),
        dateRange: {
          from: dates[0],
          to: dates[dates.length - 1]
        },
        currencies
      }
    }
  }
}