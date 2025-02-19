import { BarChart3, ThumbsUp, Users, Star, Frown, MehIcon, SmileIcon, TrendingUp, Calendar, Filter, Download, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';

type Period = '7d' | '30d' | '90d' | '12m';

export default function Dashboard(){

    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('30d');
    const periods = [
        { value: '7d', label: 'Últimos 7 dias' },
        { value: '30d', label: 'Últimos 30 dias' },
        { value: '90d', label: 'Últimos 90 dias' },
        { value: '12m', label: 'Últimos 12 meses' },
    ];

    const getEmojiForRating = (value: number) => {
        const baseClass = "w-6 h-6";
    switch(value) {
        case 1: return <Frown className={`${baseClass} text-red-500`} />;
        case 2: return <MehIcon className={`${baseClass} text-red-400`} />;
        case 3: return <MehIcon className={`${baseClass} text-yellow-500`} />;
        case 4: return <SmileIcon className={`${baseClass} text-green-400`} />;
        case 5: return <SmileIcon className={`${baseClass} text-green-500`} />;
        default: return null;
    }
    };
    
        return (
                <>
                <div className="">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-semibold">Pesquisa NPS</span>
                        </div>
                    </div>
                    </div>
                </nav>
                </div>  
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header com filtros */}
                        <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Feedback</h1>
                        <div className="flex gap-4">
                            <div className="relative">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50">
                                <Calendar className="w-4 h-4" />
                                <span>{periods.find(p => p.value === selectedPeriod)?.label}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filtros</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            <span>Exportar</span>
                            </button>
                        </div>
                        </div>
                
                        {/* Cards principais */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">NPS Geral</p>
                                <h3 className="text-2xl font-bold">75</h3>
                            </div>
                            <div className="flex items-center text-green-500">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm">+5%</span>
                            </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Total de Respostas</p>
                                <h3 className="text-2xl font-bold">1.234</h3>
                            </div>
                            <div className="flex items-center text-green-500">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm">+12%</span>
                            </div>
                            </div>
                            <TrendingUp className="w-full h-8 text-blue-500" />
                        </div>
                
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Taxa de Resposta</p>
                                <h3 className="text-2xl font-bold">68%</h3>
                            </div>
                            <div className="flex items-center text-red-500">
                                <ArrowDownRight className="w-4 h-4" />
                                <span className="text-sm">-3%</span>
                            </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                        </div>
                
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Média de Avaliação</p>
                                <h3 className="text-2xl font-bold">4.2</h3>
                            </div>
                            <div className="flex items-center text-green-500">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm">+0.3</span>
                            </div>
                            </div>
                            <div className="flex justify-between items-center">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <div key={value} className="transform scale-75">
                                {getEmojiForRating(value)}
                                </div>
                            ))}
                            </div>
                        </div>
                        </div>
                
                        {/* Tabela de feedbacks recentes */}
                        <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold">Feedbacks Recentes</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                { date: '2024-03-15', score: 5, text: "Ótimo serviço, sempre confiável!", status: 'Respondido' },
                                { date: '2024-03-14', score: 3, text: "Bom no geral, mas poderia ser mais rápido", status: 'Pendente' },
                                { date: '2024-03-14', score: 5, text: "Adorei o suporte ao cliente", status: 'Respondido' },
                                { date: '2024-03-13', score: 2, text: "Tive problemas com o último pedido", status: 'Em análise' },
                                { date: '2024-03-13', score: 4, text: "Melhorou muito desde a última vez", status: 'Pendente' }
                                ].map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                                        {getEmojiForRating(item.score)}
                                    </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.text}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${item.status === 'Respondido' ? 'bg-green-100 text-green-800' : 
                                        item.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-blue-100 text-blue-800'}`}>
                                        {item.status}
                                    </span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                
            </main>
        </>
    );
}