'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { uk } from 'date-fns/locale'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  Search
} from 'lucide-react'
import { DuplicateDetectionResult } from '@/lib/services/duplicate-detection'

interface Payment {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  type: 'SUBSCRIPTION' | 'ONE_TIME'
  provider: 'STRIPE' | 'LIQPAY'
  providerPaymentId: string | null
  userId: string
  subscriptionId: string | null
  metadata: any
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)
  const [duplicateResult, setDuplicateResult] = useState<DuplicateDetectionResult | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'pending'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments')
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkDuplicates = async () => {
    setCheckingDuplicates(true)
    try {
      const response = await fetch('/api/admin/payments/check-duplicates', {
        method: 'POST'
      })
      const result = await response.json()
      setDuplicateResult(result)
      
      // Refresh payments to show updated statuses
      await fetchPayments()
    } catch (error) {
      console.error('Error checking duplicates:', error)
    } finally {
      setCheckingDuplicates(false)
    }
  }

  const markAsDuplicate = async (paymentId: string, originalPaymentId: string) => {
    try {
      await fetch('/api/admin/payments/mark-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, originalPaymentId })
      })
      
      // Refresh data
      await fetchPayments()
      await checkDuplicates()
    } catch (error) {
      console.error('Error marking as duplicate:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'REFUNDED':
        return <RefreshCw className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status.toLowerCase() === filter
    const matchesSearch = !searchTerm || 
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.providerPaymentId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Платежі</h1>
        <p className="text-gray-600">Управління платежами та перевірка дублікатів</p>
      </div>

      {/* Duplicate Check Alert */}
      {duplicateResult && duplicateResult.duplicatesFound > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Знайдено {duplicateResult.duplicatesFound} дублікованих транзакцій
              </h3>
              <div className="mt-2 space-y-2">
                {duplicateResult.duplicates.slice(0, 3).map((dup, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <p>
                      User {dup.duplicate.userId} - {dup.duplicate.amount} {dup.duplicate.currency}
                      <span className="text-xs ml-2">({dup.reason})</span>
                    </p>
                    <button
                      onClick={() => markAsDuplicate(dup.duplicate.id, dup.original.id)}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Позначити як дублікат
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук за email або ID транзакції..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Всі платежі</option>
            <option value="completed">Завершені</option>
            <option value="pending">В очікуванні</option>
            <option value="failed">Невдалі</option>
          </select>
        </div>

        {/* Check Duplicates Button */}
        <button
          onClick={checkDuplicates}
          disabled={checkingDuplicates}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {checkingDuplicates ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Перевірка...
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              Перевірити дублікати
            </>
          )}
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Користувач
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сума
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Провайдер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID транзакції
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr 
                key={payment.id} 
                className={payment.metadata?.isDuplicate ? 'bg-red-50' : 'hover:bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user.name || 'Без імені'}
                    </div>
                    <div className="text-sm text-gray-500">{payment.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.amount} {payment.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {payment.type === 'SUBSCRIPTION' ? 'Підписка' : 'Одноразовий'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{payment.provider}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    {payment.metadata?.isDuplicate && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Дублікат
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(payment.createdAt), { 
                      addSuffix: true, 
                      locale: uk 
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 font-mono">
                    {payment.providerPaymentId || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Платежів не знайдено</p>
          </div>
        )}
      </div>
    </div>
  )
}