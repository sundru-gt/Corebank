import { useState, useEffect } from 'react';
import api from '../services/api';
import { Landmark, PlusCircle, ArrowRightLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accounts');
      
      const fetchedAccounts = res.data.accounts;
      
      // Initialize with no balance fetched
      const accountsWithNoBalance = fetchedAccounts.map(acc => ({
        ...acc,
        balance: null,
        loadingBalance: false
      }));
      
      setAccounts(accountsWithNoBalance);
    } catch (err) {
      setError('Failed to fetch accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchBalance = async (accountId) => {
    setAccounts(prev => prev.map(acc => 
      acc._id === accountId ? { ...acc, loadingBalance: true } : acc
    ));
    try {
      const res = await api.get(`/accounts/balance/${accountId}`);
      setAccounts(prev => prev.map(acc => 
        acc._id === accountId ? { ...acc, balance: res.data.balance, loadingBalance: false } : acc
      ));
    } catch (err) {
      setAccounts(prev => prev.map(acc => 
        acc._id === accountId ? { ...acc, balance: 'Error', loadingBalance: false } : acc
      ));
    }
  };

  const createAccount = async () => {
    try {
      await api.post('/accounts');
      fetchAccounts(); // Refresh the list
    } catch (err) {
      setError('Failed to create account.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-center sm:text-left">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/transactions"
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto"
          >
            <ArrowRightLeft className="h-5 w-5" />
            Make Transaction
          </Link>
          <button
            onClick={createAccount}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-sm w-full sm:w-auto"
          >
            <PlusCircle className="h-5 w-5" />
            New Account
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse h-32"></div>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Landmark className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new bank account.</p>
          <div className="mt-6">
            <button
              onClick={createAccount}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              New Account
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div key={account._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Account ID
                  </p>
                  <p className="mt-1 text-xs text-gray-900 font-mono bg-gray-50 p-1 rounded border inline-block">
                    {account._id}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Balance</p>
                <div className="flex items-center gap-3">
                  {account.balance !== null && (
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                      ₹{typeof account.balance === 'number' ? account.balance.toFixed(2) : account.balance}
                    </p>
                  )}
                  <button 
                    onClick={() => fetchBalance(account._id)}
                    disabled={account.loadingBalance}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {account.loadingBalance 
                      ? 'Loading...' 
                      : account.balance !== null 
                        ? 'Recheck Balance' 
                        : 'Check Balance'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
