import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Shield, Eye, Lock, Send, Menu, X, Image as ImageIcon, 
  CheckCircle, AlertCircle, User, Mail, Instagram, 
  ChevronRight, Search, Globe, Activity, Key
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp, doc, updateDoc } from "firebase/firestore";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
// Replace the values below with the ones you copied from Firebase Console
const firebaseConfig ={
apiKey: "AIzaSyCCahYayYNBbAn4bQcg3dkrdoyTD_QmdSY",


  authDomain: "trinetra-46c41.firebaseapp.com",


  projectId: "trinetra-46c41",


  storageBucket: "trinetra-46c41.firebasestorage.app",


  messagingSenderId: "325342833818",


  appId: "1:325342833818:web:7a4e8b45439d2247910323",


  measurementId: "G-C9LEBBMP80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "trinetra-mobile";

// --- Main App Component ---
// (Keep the rest of the code below this line exactly as it was)

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // home, report, admin, success
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const navigateTo = (newView) => {
    window.scrollTo(0, 0);
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigateTo('home')}
          >
            <div className="relative">
              <Eye className="w-8 h-8 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              TRINETRA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigateTo('report')}
              className="hidden md:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
            >
              <Shield className="w-4 h-4" />
              Get Help
            </button>
            <button 
              onClick={() => navigateTo('admin')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="Admin Access"
            >
              <Lock className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-16 min-h-screen flex flex-col">
        {view === 'home' && <Home onViewChange={navigateTo} />}
        {view === 'report' && <ReportForm user={user} onSuccess={() => navigateTo('success')} />}
        {view === 'success' && <SuccessView onViewChange={navigateTo} />}
        {view === 'admin' && (
          <AdminPanel 
            user={user} 
            isUnlocked={adminUnlocked} 
            setUnlocked={setAdminUnlocked} 
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 bg-slate-900 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">
            Initiated by <span className="text-purple-400 font-semibold">Hackiton</span> & <span className="text-purple-400 font-semibold">unitedes</span>
          </p>
          <p className="text-slate-600 text-xs">
            © 2025 Trinetra Campaign. Vigilance against Cybercrime.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- Sub-Components ---

function Home({ onViewChange }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 lg:py-32 px-4">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-medium uppercase tracking-widest">
            <Activity className="w-3 h-3" />
            Anti-Phishing Initiative
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            We See What You <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Can't See
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A united campaign by <strong className="text-slate-200">Hackiton</strong> and <strong className="text-slate-200">Akash</strong>. 
            We help girls who have been targeted by cybercriminals, phishers, and stalkers. 
            You are not alone. We are listening.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => onViewChange('report')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
            >
              <Shield className="w-5 h-5" />
              Report an Incident
            </button>
            <button 
              onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
            >
              How it Works
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="about" className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-purple-400" />}
          title="Secure & Private"
          desc="Your identity is protected. We use secure channels to communicate and handle your data."
        />
        <FeatureCard 
          icon={<Globe className="w-6 h-6 text-blue-400" />}
          title="Cyber Experts"
          desc="Backed by Hackiton & unitedes, our team analyzes threats and provides technical assistance."
        />
        <FeatureCard 
          icon={<User className="w-6 h-6 text-pink-400" />}
          title="Personal Support"
          desc="We don't just use bots. Real people review your proofs and guide you on the next steps."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-colors">
      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ReportForm({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    description: '',
    screenshot: null
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 400 * 1024) { // 400KB limit
        setError("Image is too large. Please use an image under 400KB.");
        e.target.value = null;
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshot: reader.result }));
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Connecting to secure server... please try again in a moment.");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'trinetra_requests'), {
        ...formData,
        userId: user.uid,
        status: 'pending', // pending, resolved, dismissed
        adminNote: '',
        createdAt: serverTimestamp(),
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Submit Report</h2>
            <p className="text-slate-400 text-sm">Your information is encrypted and secure.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Instagram ID</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={e => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Gmail Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="youremail@gmail.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Incident Description</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
              placeholder="Please describe how you were phished or what cybercrime occurred..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Proof Screenshot</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                formData.screenshot ? 'border-purple-500/50 bg-purple-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.screenshot ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-xs h-32 rounded-lg overflow-hidden mb-2 border border-slate-700">
                    <img src={formData.screenshot} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Image Loaded
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Click to change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Click to upload screenshot</span>
                  <span className="text-xs mt-1 opacity-60">Max size 400KB</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function SuccessView({ onViewChange }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Report Received</h2>
        <p className="text-slate-400 mb-8">
          Thank you for reaching out. Trinetra team (Hackiton & unitedes) has received your details. We will verify your proofs and contact you via the provided Gmail or Instagram ID shortly.
        </p>
        <button 
          onClick={() => onViewChange('home')}
          className="bg-slate-800 text-white px-8 py-3 rounded-xl hover:bg-slate-700 transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

// --- Admin Section ---

function AdminPanel({ user, isUnlocked, setUnlocked }) {
  const [requests, setRequests] = useState([]);
  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Load Requests
  useEffect(() => {
    if (!user || !isUnlocked) return;
    
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'trinetra_requests')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort manually since we can't use complex orderBy
      data.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA; // Newest first
      });
      setRequests(data);
    });

    return () => unsubscribe();
  }, [user, isUnlocked]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === 'trinetra-admin') {
      setUnlocked(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied: Invalid Security Key');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const ref = doc(db, 'artifacts', appId, 'public', 'data', 'trinetra_requests', id);
      await updateDoc(ref, { status: newStatus });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-sm w-full shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-white mb-6">Restricted Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter Admin Passkey"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-center tracking-widest focus:border-red-500 focus:outline-none"
              />
            </div>
            {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" /> Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-100">Inbox ({requests.length})</h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" title="Online" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No pending requests</div>
          ) : (
            requests.map(req => (
              <div 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors ${selectedRequest?.id === req.id ? 'bg-slate-800 border-l-2 border-l-purple-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-slate-200">{req.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    req.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 
                    req.status === 'dismissed' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{req.email}</p>
                <p className="text-xs text-slate-500 mt-2 truncate">{req.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
        {selectedRequest ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedRequest.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedRequest.email}</span>
                  <span className="flex items-center gap-1"><Instagram className="w-3 h-3" /> {selectedRequest.instagram}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(selectedRequest.id, 'resolved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRequest.status === 'resolved' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-green-900/30'}`}
                >
                  Resolve
                </button>
                <button 
                  onClick={() => updateStatus(selectedRequest.id, 'dismissed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRequest.status === 'dismissed' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-red-900/30'}`}
                >
                  Dismiss
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Incident Report</h3>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedRequest.description}
              </p>
            </div>

            {selectedRequest.screenshot && (
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Evidence Proof</h3>
                <div className="rounded-lg overflow-hidden border border-slate-800">
                  <img src={selectedRequest.screenshot} alt="Evidence" className="w-full h-auto" />
                </div>
              </div>
            )}
            
            <div className="text-right text-xs text-slate-600">
              ID: {selectedRequest.id}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a request from the sidebar to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}


