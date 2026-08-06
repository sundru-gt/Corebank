import { useState, useEffect } from 'react';
import api from '../services/api';
import { ArrowRightLeft, CreditCard, Hash, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data.accounts);
        if (res.data.accounts.length > 0) {
          setFromAccount(res.data.accounts[0]._id);
        }
      } catch (err) {
        setError('Failed to load accounts.');
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromAccount || !toAccount || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        fromAccount,
        toAccount,
        amount: Number(amount),
        idempotencyKey
      };

      await api.post('/transactions', payload);
      setSuccess('Transaction completed successfully!');
      setToAccount('');
      setAmount('');

      // Navigating back to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ArrowRightLeft className="h-8 w-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Make a Transfer</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
              >
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>
                    Account: {acc._id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Account ID</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors"
                placeholder="Recipient Account ID"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black shadow-sm'} transition-colors`}
          >
            {loading ? 'Processing...' : 'Complete Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
