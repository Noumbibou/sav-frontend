import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';

const CHANNELS = [
  {
    value: 'EMAIL', label: 'Email', icon: (
      <path d="M4 4h16v16H4z M4 4l8 8 8-8" />
    ),
  },
  {
    value: 'CHAT', label: 'Chat', icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    ),
  },
  {
    value: 'TELEPHONE', label: 'Téléphone', icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    ),
  },
];

function FieldIcon({ children }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 peer-focus:text-brand-600 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center animate-fade-in-up">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-green-400/40 animate-ping-soft" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/20 animate-scale-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Demande envoyée avec succès</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            Votre ticket a été enregistré. Un email de confirmation vous a été envoyé à <span className="font-medium text-gray-700">{form.email}</span>.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/tickets/${succes.id}`)}
              className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all"
            >
              Voir ma demande
            </button>
            <button
              onClick={() => { setSucces(null); setForm({ name: '', email: '', phone: '', channel: 'EMAIL', title: '', description: '' }); }}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all"
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
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center ring-1 ring-brand-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Créer une demande de support</h1>
            <p className="text-gray-500 text-sm mt-0.5">Décrivez votre problème, notre équipe vous répondra rapidement.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
        {erreur && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 text-red-700 rounded-lg text-sm ring-1 ring-red-100 animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{erreur}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in-up animation-delay-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
            <div className="relative">
              <FieldIcon><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></FieldIcon>
              <input
                type="text" value={form.name} onChange={update('name')} required
                placeholder="Jean Dupont"
                className="peer w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <FieldIcon><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></FieldIcon>
              <input
                type="email" value={form.email} onChange={update('email')} required
                placeholder="vous@entreprise.com"
                className="peer w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in-up animation-delay-150">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <div className="relative">
              <FieldIcon><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" /></FieldIcon>
              <input
                type="tel" value={form.phone} onChange={update('phone')}
                placeholder="06 12 34 56 78"
                className="peer w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Canal préféré</label>
            <div className="grid grid-cols-3 gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, channel: c.value }))}
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    form.channel === c.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/10'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    {c.icon}
                  </svg>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre de la demande</label>
          <div className="relative">
            <FieldIcon><path d="M4 6h16M4 12h10M4 18h6" /></FieldIcon>
            <input
              type="text" value={form.title} onChange={update('title')} required
              placeholder="Ex: Problème de connexion à mon compte"
              className="peer w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
            />
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-250">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description} onChange={update('description')} required rows={5}
            placeholder="Décrivez votre problème en détail..."
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
          />
        </div>

        <button
          type="submit" disabled={enCours}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed animate-fade-in-up animation-delay-300 flex items-center justify-center gap-2"
        >
          {enCours ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
              </svg>
              Envoi en cours...
            </>
          ) : (
            'Envoyer ma demande'
          )}
        </button>
      </form>
    </PublicLayout>
  );
}

export default CreateTicketPage;
