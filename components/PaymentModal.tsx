import React, { useState } from 'react';
import { Project } from '../types';
import { CreditCard, Lock, ShieldCheck, X, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ project, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setStep('processing');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('success');
    setTimeout(() => {
      onSuccess(project.id);
    }, 1500);
  };

  const serviceFee = project.budget * 0.10;
  const vendorPayout = project.budget - serviceFee;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800">
            <ShieldCheck className="text-green-600" size={20} />
            <span className="font-bold">Secure Payment Gateway</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handlePay} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex justify-between text-sm mb-2 text-gray-600">
                  <span>Project Cost</span>
                  <span>₹{project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2 text-gray-600">
                  <span>Client Service Fee</span>
                  <span className="text-green-600 font-medium">Free (₹0.00)</span>
                </div>
                <div className="border-t border-blue-200 my-2 pt-2 flex justify-between font-bold text-lg text-blue-900">
                  <span>Total Payable</span>
                  <span>₹{project.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Information</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                Pay ₹{project.budget.toLocaleString()}
              </button>
              
              <div className="flex justify-center gap-4 opacity-50">
                 {/* Simple visual placeholders for card logos */}
                 <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">VISA</div>
                 <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">MC</div>
                 <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">AMEX</div>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Processing Payment...</h3>
              <p className="text-sm text-gray-500">Please do not close this window.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-50">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
              <p className="text-sm text-gray-500 mt-1">Funds have been deposited into escrow.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;