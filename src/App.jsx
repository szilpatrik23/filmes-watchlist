import { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [filmek, setFilmek] = useState([]);
  const [ujCim, setUjCim] = useState('');
  const [ujMufaj, setUjMufaj] = useState('Akció');

  useEffect(() => {
    const filmekGyujtemeny = collection(db, "movies");
    
    const leiratkozas = onSnapshot(filmekGyujtemeny, (snapshot) => {
      const ListazottFilmek = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFilmek(ListazottFilmek);
    });

    return () => leiratkozas(); 
  }, []);

  const handleHozazadas = async (e) => {
    e.preventDefault(); 
    if (ujCim.trim() === '') return;

    try {
      await addDoc(collection(db, "movies"), {
        cim: ujCim,
        mufaj: ujMufaj,
        datum: new Date().toLocaleDateString('hu-HU')
      });
      setUjCim(''); 
    } catch (hiba) {
      console.error("Hiba történt a mentés során: ", hiba);
    }
  };

  const handleTorles = async (id) => {
    try {
      await deleteDoc(doc(db, "movies", id));
    } catch (hiba) {
      console.error("Hiba történt a törlés során: ", hiba);
    }
  };

  return (
    <>
      {/* Ebbe a STYLE blokkba tettem bele a profi dizájnt! 
        Így egyetlen fájlban marad minden, de mégis támogatja az egeres (hover) animációkat. 
      */}
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #141414; /* Sötét "Netflix" háttér */
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #ffffff;
        }
        .alkalmazas-tarolo {
          max-width: 800px;
          margin: 50px auto;
          padding: 30px;
          background: #1f1f1f;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .fejlec {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #e50914; /* Piros kiemelés */
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .urlap {
          display: flex;
          gap: 15px;
          margin-bottom: 40px;
        }
        .bevitel, .lenyilo {
          background-color: #333;
          color: white;
          border: 1px solid #444;
          padding: 15px;
          font-size: 1rem;
          border-radius: 6px;
          outline: none;
        }
        .bevitel {
          flex: 2;
        }
        .bevitel:focus, .lenyilo:focus {
          border-color: #e50914;
        }
        .lenyilo {
          flex: 1;
          cursor: pointer;
        }
        .hozzaad-gomb {
          background-color: #e50914;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }
        .hozzaad-gomb:hover {
          background-color: #f40612;
          transform: scale(1.05);
        }
        .lista {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .film-elem {
          background-color: #2b2b2b;
          border-left: 6px solid #e50914; /* Piros oldalsó csík */
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: 0.2s;
        }
        .film-elem:hover {
          background-color: #333;
        }
        .film-cim {
          font-size: 1.3rem;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .film-mufaj {
          background-color: #444;
          color: #ccc;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          margin-left: 15px;
          vertical-align: middle;
        }
        .film-datum {
          display: block;
          margin-top: 8px;
          font-size: 0.85rem;
          color: #888;
        }
        .torles-gomb {
          background: transparent;
          color: #999;
          border: 1px solid #666;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.3s;
        }
        .torles-gomb:hover {
          background: #e50914;
          color: white;
          border-color: #e50914;
        }
        .ures-uzenet {
          text-align: center;
          color: #777;
          font-size: 1.2rem;
          padding: 20px;
        }
      `}</style>

      {/* Maga a weboldal HTML szerkezete */}
      <div className="alkalmazas-tarolo">
        <h1 className="fejlec">🍿 Filmes Kívánságlista</h1>
        
        <form onSubmit={handleHozazadas} className="urlap">
          <input 
            type="text" 
            placeholder="Mit szeretnél megnézni?" 
            value={ujCim}
            onChange={(e) => setUjCim(e.target.value)}
            className="bevitel"
          />
          <select 
            value={ujMufaj} 
            onChange={(e) => setUjMufaj(e.target.value)}
            className="lenyilo"
          >
            <option value="Akció">Akció</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Dráma">Dráma</option>
            <option value="Vígjáték">Vígjáték</option>
            <option value="Horror">Horror</option>
            <option value="Sorozat">Sorozat</option>
            <option value="Sorozat">Krimi</option>
            <option value="Sorozat">Romantikus</option>
            <option value="Sorozat">Thriller</option>
            <option value="Sorozat">Fantasy</option>
          </select>
          <button type="submit" className="hozzaad-gomb">Hozzáadás</button>
        </form>

        <ul className="lista">
          {filmek.length === 0 ? (
            <p className="ures-uzenet">Üres a lista. Ideje hozzáadni egy jó filmet!</p>
          ) : (
            filmek.map((film) => (
              <li key={film.id} className="film-elem">
                <div>
                  <span className="film-cim">{film.cim}</span> 
                  <span className="film-mufaj">{film.mufaj}</span>
                  <span className="film-datum">Hozzáadva: {film.datum}</span>
                </div>
                <button onClick={() => handleTorles(film.id)} className="torles-gomb">Törlés</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default App;