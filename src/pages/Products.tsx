import Title from '../components/Title';
import { PrimaryButton } from '../components/Buttons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRequestQuote = () => {
    if (isAuthenticated) {
      navigate('/contact');
    } else {
      navigate('/login');
    }
  };
  const products = [
    {
      id: 'silver',
      title: 'Silver Steel Letters',
      desc: 'Brushed and mirror-finish stainless steel letters with durable mounting options.',
    },
    {
      id: 'golden',
      title: 'Golden Steel Letters',
      desc: 'Gold-plated or gold-painted stainless letters for premium signage.',
    },
    {
      id: 'led',
      title: 'LED Boards',
      desc: 'Illuminated signboards and halo-lit letters with energy-efficient LEDs.',
    },
    {
      id: 'nameplates',
      title: 'Name Plates',
      desc: 'Custom stainless-steel name plates for offices, residences and plaques.',
    },
  ];

  const imageMap: Record<string, string> = {
    silver: '/works/12.jpeg',
    golden: '/works/13.jpeg',
    led: '/works/14.jpeg',
    nameplates: '/works/15.jpeg',
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <Title title="Products" heading="Our Products" description="Choose from our range of stainless steel letters, illuminated boards and custom name plates." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white/3 border border-white/6 rounded-lg p-0 overflow-hidden flex flex-col">
            <div className="h-40 w-full bg-gray-800/10 overflow-hidden">
              <img
                src={imageMap[p.id]}
                alt={p.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white">{p.title}</h3>
              <p className="text-gray-300 flex-1">{p.desc}</p>
              <div className="pt-2">
                <button onClick={handleRequestQuote}>
                  <PrimaryButton>Request Quote</PrimaryButton>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
