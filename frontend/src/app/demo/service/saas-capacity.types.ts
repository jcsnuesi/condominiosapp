export interface CondominiumCapacity { condominiumId: string; name: string; active: boolean; used: number; capacity: number; }
export interface CapacityView {
  resource: 'units' | 'residences'; included: number | null; additional: number; total: number | null; used: number;
  revision: number; distributionEnabled: boolean; canEnableDistribution: boolean; allocated: number; unallocated: number | null;
  condominiums: CondominiumCapacity[];
}
export interface CapacityTerms { priceMinor: number; basePriceMinor?: number; additionalQuantity?: number; extraPriceMinor?: number | null; }
export interface CapacityChange {
  _id: string; state: string; before: CapacityTerms; after: CapacityTerms; prorationMinor: number;
  effectiveAt: string; expiresAt: string; approvalUrl: string | null; paymentUrl: string | null;
  failureReason?: string | null;
}
export interface BillingAdjustment { _id: string; differenceMinor: number; state: string; paymentUrl?: string; }
export interface CapacitySubscriptionView {
  capacity?: CapacityView | null; pendingChange?: CapacityChange | null; adjustments?: BillingAdjustment[];
  extraPriceMinor?: number | null; checkoutEnabled: boolean;
  subscription: { state: string } | null;
}
