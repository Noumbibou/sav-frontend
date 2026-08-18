import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';

function SurveyPage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [chargement, setChargement] = useState(true);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    axiosClient.get('/api/surveys')
      .then((res) => {
        const found = res.data.find((s) => s.id === id);
        setSurvey(found || null);
        if (found?.score) setEnvoye(true);
      })
      .catch(() => setSurvey(null))
      .finally(() => setChargement(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === 0) {
      setErreur('Veuillez sélectionner une note.');
      return;
    }
    setErreur('');

    try {
      await axiosClient.patch(`/api/surveys/${id}/repondre`, { score, comment });
      setEnvoye(true);
    } catch (err) {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (chargement) {
    return <PublicLayout><p className="text-gray-400 text-sm">Chargement...</p></PublicLayout>;
  }

  if (!survey) {
    return (
      <PublicLayout>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
          Enquête introuvable.
        </div>
      </PublicLayout>
    );
  }

  if (envoye) {
    return (
      <PublicLayout>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Merci pour votre retour !</h1>
          <p className="text-gray-500">Votre avis nous aide à améliorer notre service.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Votre avis compte</h1>
        <p className="text-gray-500 text-sm mb-6">Comment évaluez-vous la résolution de votre demande ?</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {erreur && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{erreur}</div>}

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                className={`w-12 h-12 rounded-full text-lg font-semibold transition-colors ${
                  score >= n ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">1 = très insatisfait · 5 = très satisfait</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire (optionnel)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Partagez votre expérience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Envoyer mon avis
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}

export default SurveyPage;