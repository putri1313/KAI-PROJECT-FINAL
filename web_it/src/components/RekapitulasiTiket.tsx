
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const RekapitulasiTiket = () => {
  const monthlyTickets = [
    { bulan: 'Jan 2024', total: 156, resolved: 148, pending: 5, closed: 3, avgTime: 4.2 },
    { bulan: 'Feb 2024', total: 142, resolved: 138, pending: 2, closed: 2, avgTime: 3.8 },
    { bulan: 'Mar 2024', total: 167, resolved: 159, pending: 6, closed: 2, avgTime: 4.1 },
    { bulan: 'Apr 2024', total: 134, resolved: 129, pending: 3, closed: 2, avgTime: 3.9 },
    { bulan: 'Mei 2024', total: 149, resolved: 143, pending: 4, closed: 2, avgTime: 4.0 },
    { bulan: 'Jun 2024', total: 158, resolved: 151, pending: 5, closed: 2, avgTime: 3.7 }
  ];

  const ticketCategories = [
    { kategori: 'Network Issues', count: 45, percentage: 28.5, avgResolution: 6.2, priority: 'high' },
    { kategori: 'Hardware Failure', count: 38, percentage: 24.1, avgResolution: 8.5, priority: 'high' },
    { kategori: 'Software Problems', count: 32, percentage: 20.3, avgResolution: 4.1, priority: 'medium' },
    { kategori: 'User Support', count: 28, percentage: 17.7, avgResolution: 2.3, priority: 'low' },
    { kategori: 'Security Incidents', count: 15, percentage: 9.5, avgResolution: 12.4, priority: 'critical' }
  ];

  const slaMetrics = [
    { metric: 'First Response Time', target: '< 2 hours', actual: '1.5 hours', status: 'met' },
    { metric: 'Resolution Time (P1)', target: '< 4 hours', actual: '3.2 hours', status: 'met' },
    { metric: 'Resolution Time (P2)', target: '< 8 hours', actual: '6.8 hours', status: 'met' },
    { metric: 'Resolution Time (P3)', target: '< 24 hours', actual: '18.5 hours', status: 'met' },
    { metric: 'Customer Satisfaction', target: '> 90%', actual: '92.3%', status: 'met' },
    { metric: 'Escalation Rate', target: '< 10%', actual: '7.2%', status: 'met' }
  ];

  const currentMonth = monthlyTickets[monthlyTickets.length - 1];
  const prevMonth = monthlyTickets[monthlyTickets.length - 2];
  const growthRate = ((currentMonth.total - prevMonth.total) / prevMonth.total * 100).toFixed(1);

  const recentTickets = [
    { id: 'TK-2024-0891', category: 'Network Issues', description: 'Koneksi internet stasiun Kotabumi terputus', priority: 'High', status: 'In Progress', assignee: 'Andi Wijaya', timeLeft: '2 hours' },
    { id: 'TK-2024-0892', category: 'Hardware Failure', description: 'Server ticketing Tanjungkarang down', priority: 'Critical', status: 'Resolved', assignee: 'Siti Nurhaliza', timeLeft: 'Completed' },
    { id: 'TK-2024-0893', category: 'Software Problems', description: 'Update aplikasi CCTV gagal', priority: 'Medium', status: 'Pending', assignee: 'Fajar Sidik', timeLeft: '6 hours' },
    { id: 'TK-2024-0894', category: 'User Support', description: 'Training pengunaan sistem baru', priority: 'Low', status: 'Scheduled', assignee: 'Maya Sari', timeLeft: '1 day' },
  ];

  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Rekapitulasi Tiket BMC</h1>
        <p className="text-blue-100 text-lg">
          Laporan Bulanan Penanganan Tiket dan Monitoring SLA
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tiket Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">{currentMonth.total}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {parseFloat(growthRate) >= 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  }
                  <span className={`text-xs ${parseFloat(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{currentMonth.resolved}</p>
                <p className="text-xs text-gray-500">{((currentMonth.resolved/currentMonth.total)*100).toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{currentMonth.pending}</p>
                <p className="text-xs text-gray-500">{((currentMonth.pending/currentMonth.total)*100).toFixed(1)}%</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-blue-600">{currentMonth.avgTime}h</p>
                <p className="text-xs text-gray-500">Target: &lt; 4h</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Trend Tiket 6 Bulan Terakhir</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Bulan</th>
                  <th className="text-left p-3">Total Tiket</th>
                  <th className="text-left p-3">Resolved</th>
                  <th className="text-left p-3">Pending</th>
                  <th className="text-left p-3">Closed</th>
                  <th className="text-left p-3">Avg Time (h)</th>
                  <th className="text-left p-3">Resolution Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTickets.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{month.bulan}</td>
                    <td className="p-3">{month.total}</td>
                    <td className="p-3 text-green-600 font-medium">{month.resolved}</td>
                    <td className="p-3 text-yellow-600 font-medium">{month.pending}</td>
                    <td className="p-3 text-gray-600">{month.closed}</td>
                    <td className="p-3">{month.avgTime}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        (month.resolved/month.total)*100 >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {((month.resolved/month.total)*100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Kategori Tiket (Bulan Ini)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticketCategories.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{category.kategori}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      category.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      category.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      category.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {category.priority.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{category.count} tiket</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Persentase</p>
                    <p className="font-bold">{category.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Resolution</p>
                    <p className="font-bold">{category.avgResolution}h</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SLA Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slaMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'met' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">{metric.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual:</span>
                    <span className={`font-bold ${metric.status === 'met' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.actual}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tiket Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTickets.map((ticket, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{ticket.id}</h4>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium">{ticket.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assignee</p>
                    <p className="font-medium">{ticket.assignee}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Left</p>
                    <p className="font-medium">{ticket.timeLeft}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Report */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Highlights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• SLA compliance rate: 98.5%</li>
                <li>• Average resolution time under target</li>
                <li>• Customer satisfaction above 90%</li>
                <li>• Zero critical issues unresolved</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reduce hardware failure incidents</li>
                <li>• Faster response to network issues</li>
                <li>• Proactive monitoring implementation</li>
                <li>• Staff training on new procedures</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Action Items</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hardware preventive maintenance</li>
                <li>• Network infrastructure upgrade</li>
                <li>• Team training schedule update</li>
                <li>• Documentation improvement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RekapitulasiTiket;
