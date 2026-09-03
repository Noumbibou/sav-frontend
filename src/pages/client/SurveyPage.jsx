import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';

const SCORE_LABELS = {
  1: 'Très insatisfait',
  2: 'Insatisfait',
  3: 'Neutre',
  4: 'Satisfait',
  5: 'Très satisfait',
};

function SurveySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-64 bg-gray-100 rounded mb-8" />
      <div className="flex justify-center gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((n) => <div key={n} className="w-12 h-12 rounded-full bg-gray-100" />)}
      </div>
      <div className="h-24 w-full bg-gray-100 rounded-lg mb-6" />
      <div className="h-10 w-full bg-gray-200 rounded-lg" />
    </div>
  );
}

function SurveyPage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
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
    return <PublicLayout><SurveySkeleton /></PublicLayout>;
  }

  if (!survey) {
    return (
      <PublicLayout>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center animate-fade-in-up">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Enquête introuvable.</p>
        </div>
      </PublicLayout>
    );
  }

  if (envoye) {
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
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Merci pour votre retour !</h1>
          <p className="text-gray-500">Votre avis nous aide à améliorer notre service.</p>
        </div>
      </PublicLayout>
    );
  }

  const displayScore = hoverScore || score;

  return (
    <PublicLayout>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center ring-1 ring-brand-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.977-2.89c-.782-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Votre avis compte</h1>
            <p className="text-gray-500 text-sm mt-0.5">Comment évaluez-vous la résolution de votre demande ?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <div className="flex justify-center gap-3" onMouseLeave={() => setHoverScore(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  onMouseEnter={() => setHoverScore(n)}
                  className={`w-12 h-12 rounded-full text-lg font-semibold transition-all duration-150 ${
                    score >= n
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 scale-105'
                      : hoverScore >= n
                        ? 'bg-brand-100 text-brand-700 scale-105'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-3 h-4 transition-opacity">
              {displayScore ? SCORE_LABELS[displayScore] : '1 = très insatisfait · 5 = très satisfait'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Commentaire <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Partagez votre expérience..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all"
          >
            Envoyer mon avis
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}

export default SurveyPage;
