import Header from '@/components/Layout/Header'
import Link from 'next/link'

const CATEGORIES = [
  { key: 'pedreiro', label: 'Pedreiro', emoji: '👷' },
  { key: 'encanador', label: 'Encanador', emoji: '🧰' },
  { key: 'pintor', label: 'Pintor', emoji: '🎨' },
  { key: 'eletricista', label: 'Eletricista', emoji: '💡' },
  { key: 'cuidador', label: 'Cuidador', emoji: '🧑‍⚕️' },
  { key: 'enfermeira', label: 'Enfermeira', emoji: '🏥' },
  { key: 'domestica', label: 'Doméstica', emoji: '🧹' },
  { key: 'faz-tudo', label: 'Faz Tudo', emoji: '🛠️' },
]

const SERVICES = CATEGORIES.map(c => ({ key: c.key, label: c.label }))

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Encontre Serviços
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Conectando você aos melhores prestadores de serviço da sua região
            </p>
          </div>

          {/* Busca */}
          <form
            action="/resultados"
            className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="servico" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Serviço
                </label>
                <select
                  id="servico"
                  name="servico"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black dark:text-white dark:bg-gray-700"
                  defaultValue={SERVICES[0]?.key}
                >
                  {SERVICES.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade
                </label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  placeholder="Digite sua cidade"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black dark:text-white dark:bg-gray-700"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>

          {/* Categorias */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categorias populares</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/resultados?servico=${cat.key}`}
                  className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 p-3 transition-colors"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Encontre profissionais perto de você!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Conectando você aos melhores prestadores de serviço da sua região.
              </p>
            </div>
            <Link
              href="/cadastro"
              className="shrink-0 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

