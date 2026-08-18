import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';

const CHANNELS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'CHAT', label: 'Chat' },
  { value: 'TELEPHONE', label: 'Téléphone' },
];

function CreateTicketPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', channel: 'EMAIL', title: '', description: '',
  });
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(null);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const trouverOuCreerCustomer = async () => {
    try {
      const res = await axiosClient.get(`/api/customers/by-email/${encodeURIComponent(form.email)}`);
      return res.data.id;
    } catch (err) {
      const res = await axiosClient.post('/api/customers', {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      return res.data.id;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnCours(true);

    try {
      const customerId = await trouverOuCreerCustomer();

      const res = await axiosClient.post('/api/tickets', {
        title: form.title,
        description: form.description,
        channel: form.channel,
        customerId,
      });

      localStorage.setItem('clientEmail', form.email);
      setSucces(res.data);
    } catch (err) {
      setErreur("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
    } finally {
      setEnCours(false);
    }
  };

  if (succes) {
    return (
      <PublicLayout>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Demande envoyée avec succès</h1>
          <p className="text-gray-500 mb-6">
            Votre ticket a été enregistré. Un email de confirmation vous a été envoyé à {form.email}.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/tickets/${succes.id}`)}
              className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Voir ma demande
            </button>
            <button
              onClick={() => { setSucces(null); setForm({ name: '', email: '', phone: '', channel: 'EMAIL', title: '', description: '' }); }}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer une demande de support</h1>
        <p className="text-gray-500 text-sm mt-1">Décrivez votre problème, notre équipe vous répondra rapidement.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {erreur && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{erreur}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text" value={form.name} onChange={update('name')} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={form.email} onChange={update('email')} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
            <input
              type="tel" value={form.phone} onChange={update('phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
            <select
              value={form.channel} onChange={update('channel')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la demande</label>
          <input
            type="text" value={form.title} onChange={update('title')} required
            placeholder="Ex: Problème de connexion à mon compte"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description} onChange={update('description')} required rows={5}
            placeholder="Décrivez votre problème en détail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit" disabled={enCours}
          className="w-full bg-brand-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {enCours ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>
      </form>
    </PublicLayout>
  );
}

export default CreateTicketPage;