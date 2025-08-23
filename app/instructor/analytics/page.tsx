'use client'

import { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { 
  TrendingUp, Users, BookOpen, Clock, DollarSign, 
  Calendar, Download, Filter, ChevronDown
} from 'lucide-react'

// Mock data for charts
const revenueData = [
  { month: 'Січ', revenue: 45000, students: 12 },
  { month: 'Лют', revenue: 52000, students: 15 },
  { month: 'Бер', revenue: 48000, students: 14 },
  { month: 'Кві', revenue: 61000, students: 18 },
  { month: 'Тра', revenue: 58000, students: 17 },
  { month: 'Чер', revenue: 72000, students: 22 },
]

const coursePerformance = [
  { name: '8 принципів', students: 89, completion: 92, rating: 4.9, revenue: 44500 },
  { name: 'Екстрене гальмування', students: 67, completion: 88, rating: 4.8, revenue: 33500 },
  { name: 'Міська їзда', students: 45, completion: 78, rating: 4.7, revenue: 22500 },
  { name: 'Нічна їзда', students: 34, completion: 85, rating: 4.6, revenue: 17000 },
]

const studentEngagement = [
  { day: 'Пн', active: 45, lessons: 120 },
  { day: 'Вт', active: 52, lessons: 145 },
  { day: 'Ср', active: 48, lessons: 130 },
  { day: 'Чт', active: 55, lessons: 160 },
  { day: 'Пт', active: 60, lessons: 180 },
  { day: 'Сб', active: 72, lessons: 220 },
  { day: 'Нд', active: 68, lessons: 200 },
]

const completionByDifficulty = [
  { name: 'Початківець', value: 85, color: '#10b981' },
  { name: 'Середній', value: 72, color: '#3b82f6' },
  { name: 'Просунутий', value: 65, color: '#8b5cf6' },
]

const topContent = [
  { title: 'Принцип блокерів', views: 1234, avgTime: '12:30', completion: 94 },
  { title: 'Екстрене гальмування: практика', views: 1089, avgTime: '15:45', completion: 88 },
  { title: 'Проїзд перехресть', views: 987, avgTime: '10:20', completion: 91 },
  { title: 'Хвильова природа небезпеки', views: 876, avgTime: '11:15', completion: 89 },
  { title: 'Trail braking техніка', views: 765, avgTime: '13:40', completion: 82 },
]

export default function InstructorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Аналітика</h1>
          <p className="mt-2 text-gray-600">Детальна статистика вашої викладацької діяльності</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Фільтри</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-5 h-5" />
            <span>Експорт звіту</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Останні 7 днів</option>
              <option value="30days">Останні 30 днів</option>
              <option value="3months">Останні 3 місяці</option>
              <option value="6months">Останні 6 місяців</option>
              <option value="1year">Останній рік</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">Всі курси</option>
              <option value="8-principles">8 принципів Небачива</option>
              <option value="emergency-braking">Екстрене гальмування</option>
              <option value="city-riding">Міська їзда</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">Всі учні</option>
              <option value="active">Активні</option>
              <option value="completed">Завершили</option>
              <option value="new">Нові</option>
            </select>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Скинути фільтри
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+18%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">324,500 ₴</div>
          <div className="text-sm text-gray-600">Загальний дохід</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">+23%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">234</div>
          <div className="text-sm text-gray-600">Активних учнів</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">87%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-600">Активних курсів</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600 font-medium">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">42.5 год</div>
          <div className="text-sm text-gray-600">Середній час навчання</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Дохід та нові учні</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Дохід (₴)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="students" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Нові учні"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Engagement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Активність учнів</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="active" 
                stackId="1" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6}
                name="Активні учні"
              />
              <Area 
                type="monotone" 
                dataKey="lessons" 
                stackId="2" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.6}
                name="Пройдені уроки"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Продуктивність курсів</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coursePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#3b82f6" name="Учні" />
              <Bar dataKey="completion" fill="#10b981" name="Завершення %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion by Difficulty */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Завершення за складністю</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionByDifficulty}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {completionByDifficulty.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Content Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Топ контент</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Урок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Перегляди
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Середній час
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Завершення
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topContent.map((content, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {content.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.avgTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${content.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{content.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}