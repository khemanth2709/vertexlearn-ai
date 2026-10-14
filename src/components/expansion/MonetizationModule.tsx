import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Check, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Percent, 
  Users, 
  Clock, 
  Building, 
  Zap, 
  Award, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Wallet,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { SubscriptionPlan, CouponCode, InstructorPayoutRecord } from '../../types/lms';

export const MonetizationModule: React.FC = () => {
  const { user, recordAuditLog } = useLMS();

  // Active Currency
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
  const currencyRates = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    INR: { symbol: '₹', rate: 84.0 }
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<'plans' | 'payouts' | 'coupons'>('plans');

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'razorpay'>('stripe');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [upiId, setUpiId] = useState('developer@okhdfcbank');

  // Subscription Plans
  const plans: SubscriptionPlan[] = [
    {
      id: 'plan-starter',
      name: 'Free Community Track',
      priceUSD: 0,
      billingInterval: 'month',
      description: 'Foundational learning for open-source learners and auditing course materials.',
      features: [
        'Access to 10+ public core courses',
        'Standard Judge0 code runner (20 runs/day)',
        'Public cohort community discussion channels',
        'Basic automated module completion certificates'
      ]
    },
    {
      id: 'plan-pro',
      name: 'Pro Developer Track',
      priceUSD: 29,
      billingInterval: 'month',
      popular: true,
      description: 'Accelerated engineering track with unlimited AI tutoring and live study rooms.',
      features: [
        'Unlimited access to all 32 specialized curriculum tracks',
        'Unlimited AI Technical Tutor queries with Voice STT/TTS',
        'Real-time WebRTC collaborative study rooms & whiteboards',
        'Interactive Judge0 sandbox with Python & C++ compilers',
        'Verified cryptographically signed course certificates',
        'Priority submission grading queue'
      ]
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise Cohort Pass',
      priceUSD: 199,
      billingInterval: 'month',
      description: 'Institutional license for engineering universities and corporate cohorts.',
      features: [
        'Everything in Pro Developer Track for up to 50 team seats',
        'Automated AI Plagiarism & Code Similarity Detection engine',
        'Predictive At-Risk Student Analytics & drop-out early warnings',
        'Dedicated instructor office hours breakout pods',
        'SCORM / xAPI LMS export and custom grading rubrics',
        'Dedicated SLA & private cloud deployment support'
      ]
    }
  ];

  // Available Coupon Codes
  const [coupons, setCoupons] = useState<CouponCode[]>([
    {
      code: 'VERTEX50',
      discountType: 'percentage',
      discountValue: 50,
      maxUses: 500,
      usedCount: 214,
      validUntil: '2026-12-31',
      active: true
    },
    {
      code: 'EARLYBIRD',
      discountType: 'fixed',
      discountValue: 15,
      maxUses: 200,
      usedCount: 180,
      validUntil: '2026-11-15',
      active: true
    },
    {
      code: 'CAMPUSPRO',
      discountType: 'percentage',
      discountValue: 35,
      maxUses: 1000,
      usedCount: 429,
      validUntil: '2026-12-31',
      active: true
    }
  ]);

  // Instructor Payout History
  const [payouts, setPayouts] = useState<InstructorPayoutRecord[]>([
    {
      id: 'pay-001',
      instructorId: 'inst-01',
      period: 'September 2026',
      grossSales: 12450,
      platformCutPercent: 30,
      instructorSharePercent: 70,
      netPayoutAmount: 8715,
      status: 'PAID',
      transferMethod: 'Stripe Connect (•••• 9012)',
      processedAt: '2026-10-01'
    },
    {
      id: 'pay-002',
      instructorId: 'inst-01',
      period: 'August 2026',
      grossSales: 10800,
      platformCutPercent: 30,
      instructorSharePercent: 70,
      netPayoutAmount: 7560,
      status: 'PAID',
      transferMethod: 'Stripe Connect (•••• 9012)',
      processedAt: '2026-09-01'
    },
    {
      id: 'pay-003',
      instructorId: 'inst-01',
      period: 'October 2026 (MTD)',
      grossSales: 6300,
      platformCutPercent: 30,
      instructorSharePercent: 70,
      netPayoutAmount: 4410,
      status: 'PROCESSING',
      transferMethod: 'Stripe Connect (•••• 9012)',
      processedAt: 'In Progress (Next cycle)'
    }
  ]);

  // Helper pricing
  const convertPrice = (usd: number) => {
    const rate = currencyRates[currency].rate;
    return Math.round(usd * rate);
  };

  // Open Checkout
  const handleOpenCheckout = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setAppliedCoupon(null);
    setCouponError(null);
    setCheckoutComplete(false);
    setIsCheckoutOpen(true);
  };

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const found = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.active);

    if (found) {
      setAppliedCoupon(found);
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code. Try "VERTEX50" for 50% discount.');
    }
  };

  // Calculate Final Checkout Subtotals
  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    const base = convertPrice(selectedPlan.priceUSD);
    if (!appliedCoupon) return base;

    if (appliedCoupon.discountType === 'percentage') {
      const discount = Math.round((base * appliedCoupon.discountValue) / 100);
      return Math.max(0, base - discount);
    } else {
      const convertedFixed = convertPrice(appliedCoupon.discountValue);
      return Math.max(0, base - convertedFixed);
    }
  };

  // Process Payment
  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCheckoutComplete(true);
      recordAuditLog('USER_CREATED', `Subscribed to ${selectedPlan?.name} via ${paymentProvider.toUpperCase()} (${currencyRates[currency].symbol}${calculateTotal()})`);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-red-200">
                <Wallet className="w-3.5 h-3.5 text-[#DC2626]" />
                Multi-Gateway Billing Architecture Active
              </span>
              <span className="text-xs text-[#4B5563] font-mono">
                Stripe Billing & Razorpay UPI/Netbanking • 70/30 Instructor Split
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2.5">
              <span>Advanced Payment Gateway & Subscription Management</span>
            </h1>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">
              Commercial monetization infrastructure supporting tiered student subscriptions, automated promotional coupon redemption, multi-currency conversion, and automated instructor payout calculations.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] p-1.5 rounded-xl border border-[#E5E7EB]">
            {(['USD', 'EUR', 'GBP', 'INR'] as const).map(curr => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === curr
                    ? 'bg-[#DC2626] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#1F2937]'
                }`}
              >
                {currencyRates[curr].symbol} {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-[#E5E7EB] pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Subscription Tier Plans</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'payouts'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Instructor Revenue Payouts (70/30 Split)</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupon Engine & Discounts</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      
      {/* TAB 1: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const sym = currencyRates[currency].symbol;
            const price = convertPrice(plan.priceUSD);

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all bg-white ${
                  plan.popular
                    ? 'border-2 border-[#DC2626] shadow-md'
                    : 'border border-[#E5E7EB] shadow-xs hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#DC2626] text-white shadow-xs">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-[#1F2937]">{plan.name}</h3>
                  <p className="text-xs text-[#4B5563] mt-1 min-h-[36px]">{plan.description}</p>

                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-extrabold text-[#1F2937]">
                      {sym}{price}
                    </span>
                    <span className="text-xs text-[#4B5563] ml-1">/ month</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
                    <div className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#1F2937]">
                        <Check className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs'
                        : 'bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{plan.priceUSD === 0 ? 'Activate Free Track' : 'Upgrade to Plan'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: INSTRUCTOR REVENUE PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="text-xs text-[#4B5563]">Total Lifetime Gross Sales</div>
              <div className="text-2xl font-bold text-[#1F2937] mt-1">$29,550 USD</div>
              <div className="text-[11px] text-emerald-700 mt-1 font-semibold">+18.4% from last quarter</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="text-xs text-[#4B5563]">Instructor Share (70%)</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">$20,685 USD</div>
              <div className="text-[11px] text-[#4B5563] mt-1">Directly paid to faculty account</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="text-xs text-[#4B5563]">Platform Infrastructure Fee (30%)</div>
              <div className="text-2xl font-bold text-[#DC2626] mt-1">$8,865 USD</div>
              <div className="text-[11px] text-[#4B5563] mt-1">Judge0 sandbox & WebRTC hosting</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="text-xs text-[#4B5563]">Next Scheduled Payout</div>
              <div className="text-2xl font-bold text-amber-700 mt-1">$4,410 USD</div>
              <div className="text-[11px] text-[#4B5563] mt-1">Disbursing November 1, 2026</div>
            </div>
          </div>

          {/* Payout History Table */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Disbursement History & Remittances</h3>
                <p className="text-xs text-[#4B5563] mt-0.5">Automated Stripe Connect transfers with verifiable transaction hashes.</p>
              </div>

              <button
                onClick={() => alert('Simulating instant payout request to Stripe Connect account... Net $4,410 submitted for wire settlement.')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
              >
                Request Instant Transfer
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#4B5563] uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Payout ID</th>
                    <th className="pb-3">Cycle Period</th>
                    <th className="pb-3">Gross Sales</th>
                    <th className="pb-3">Platform Cut (30%)</th>
                    <th className="pb-3">Net Payout (70%)</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 font-mono text-[#DC2626] font-bold">{pay.id}</td>
                      <td className="py-3 font-medium text-[#1F2937]">{pay.period}</td>
                      <td className="py-3 font-mono">${pay.grossSales.toLocaleString()}</td>
                      <td className="py-3 font-mono text-[#4B5563]">
                        -${Math.round((pay.grossSales * pay.platformCutPercent) / 100).toLocaleString()}
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-700">
                        ${pay.netPayoutAmount.toLocaleString()}
                      </td>
                      <td className="py-3 text-[#4B5563]">{pay.transferMethod}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COUPONS & DISCOUNT ENGINE */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Active Promotional Coupon Codes</h3>
                <p className="text-xs text-[#4B5563] mt-0.5">Automated discount validation rules enforced at checkout.</p>
              </div>

              <button
                onClick={() => {
                  const code = prompt('Enter new coupon code (e.g. CAMPUS2026):');
                  const discount = Number(prompt('Enter percentage discount (e.g. 25):') || 20);
                  if (code) {
                    setCoupons(prev => [
                      ...prev,
                      {
                        code: code.toUpperCase(),
                        discountType: 'percentage',
                        discountValue: discount,
                        maxUses: 250,
                        usedCount: 0,
                        validUntil: '2026-12-31',
                        active: true
                      }
                    ]);
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
              >
                + Create Promo Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-extrabold text-[#DC2626] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-[#1F2937]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                    </span>
                  </div>

                  <div className="text-xs text-[#4B5563] pt-2 border-t border-[#E5E7EB] space-y-1">
                    <div className="flex justify-between">
                      <span>Redeemed:</span>
                      <span className="text-[#1F2937] font-mono">{c.usedCount} / {c.maxUses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expiry:</span>
                      <span className="text-[#1F2937] font-mono">{c.validUntil}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-[#1F2937]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Secure Checkout</h3>
                <p className="text-xs text-[#4B5563]">256-bit TLS Encrypted Transaction</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-lg text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {!checkoutComplete ? (
              <div className="p-6 space-y-5">
                {/* Plan Summary */}
                <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#1F2937]">{selectedPlan.name}</div>
                    <div className="text-xs text-[#4B5563]">Billed monthly • Cancel anytime</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#DC2626]">
                      {currencyRates[currency].symbol}{convertPrice(selectedPlan.priceUSD)}
                    </div>
                  </div>
                </div>

                {/* Gateway Switcher */}
                <div>
                  <label className="text-xs font-bold text-[#1F2937] block mb-2">Select Payment Gateway:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentProvider('stripe')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentProvider === 'stripe'
                          ? 'bg-red-50 border-[#DC2626] text-[#DC2626]'
                          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#DC2626]" />
                      <span>Stripe Card / Apple Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentProvider('razorpay')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentProvider === 'razorpay'
                          ? 'bg-red-50 border-[#DC2626] text-[#DC2626]'
                          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937]'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-[#DC2626]" />
                      <span>Razorpay UPI & Netbanking</span>
                    </button>
                  </div>
                </div>

                {/* Card or UPI Form */}
                {paymentProvider === 'stripe' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-[#4B5563] block mb-1">Card Number (Stripe Test Prefill)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#4B5563] block mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#4B5563] block mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] text-[#4B5563] block mb-1">Instant UPI ID (Virtual Payment Address)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                    />
                    <span className="text-[10px] text-[#4B5563] mt-1 block">Supports Google Pay, PhonePe, and BHIM UPI.</span>
                  </div>
                )}

                {/* Coupon Code Engine */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. VERTEX50)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs uppercase font-mono text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-gray-100 text-[#1F2937] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {appliedCoupon && (
                    <div className="mt-2 text-xs text-emerald-700 flex items-center justify-between bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span>✓ Applied "{appliedCoupon.code}" ({appliedCoupon.discountValue}% OFF)</span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-[#4B5563] hover:text-[#1F2937]"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <div className="mt-1 text-xs text-[#DC2626]">{couponError}</div>
                  )}
                </div>

                {/* Total & Checkout Action */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#4B5563]">Total Billed Today:</div>
                    <div className="text-2xl font-extrabold text-[#1F2937]">
                      {currencyRates[currency].symbol}{calculateTotal()}
                    </div>
                  </div>

                  <button
                    onClick={handleCompletePayment}
                    disabled={isProcessingPayment}
                    className="px-6 py-3 rounded-xl text-xs font-bold bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? 'Processing Gateway...' : `Confirm & Pay ${currencyRates[currency].symbol}${calculateTotal()}`}
                  </button>
                </div>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#1F2937]">Payment Successful!</h3>
                <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
                  Your subscription to <span className="text-[#DC2626] font-bold">{selectedPlan.name}</span> has been confirmed. A receipt and tax invoice have been dispatched to {user?.email}.
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
                  >
                    Return to Platform
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
