import bcrypt from 'bcryptjs'

async function testPassword() {
  const plainPassword = 'admin123'
  const hashedPassword = '$2a$10$CwTycUXWue0Thq9StjUM0ue1H7Ld1sC1l8PbV6cvjCZd5dTqpG2H6'
  
  console.log('Testing password:', plainPassword)
  console.log('Against hash:', hashedPassword)
  
  const isValid = await bcrypt.compare(plainPassword, hashedPassword)
  console.log('Result:', isValid ? '✅ Valid' : '❌ Invalid')
  
  // Create new hash
  const newHash = await bcrypt.hash(plainPassword, 10)
  console.log('\nNew hash:', newHash)
  
  // Test new hash
  const isNewValid = await bcrypt.compare(plainPassword, newHash)
  console.log('New hash test:', isNewValid ? '✅ Valid' : '❌ Invalid')
}

testPassword()