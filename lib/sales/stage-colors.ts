// Stage → badge colour map for the Sales pipeline table.
// Kept out of the page file; imported where the table renders.
export const STAGE_COLORS: Record<string, string> = {
  'Lead Captured':                        'bg-blue-50 text-blue-700',
  'Contacted – Awaiting Response':        'bg-orange-50 text-orange-700',
  'Discovery Call Booked':                'bg-amber-50 text-amber-700',
  'Needs Identified – Proposal Pending':  'bg-yellow-50 text-yellow-700',
  'Quotation Sent':                       'bg-purple-50 text-purple-700',
  'Negotiation / Follow-Up':              'bg-teal-50 text-teal-700',
  'Booking Confirmed':                    'bg-indigo-50 text-indigo-700',
  'Won – Active Client':                  'bg-green-50 text-green-700',
  'New Business':                         'bg-blue-50 text-blue-700',
  'New Business Client Contacted':        'bg-orange-50 text-orange-700',
  'Care Net Services Send To New Client': 'bg-amber-50 text-amber-700',
  'New Client Follow-up':                 'bg-yellow-50 text-yellow-700',
  'Quotation Send to New Client':         'bg-purple-50 text-purple-700',
  'Booking And Payment Received':         'bg-indigo-50 text-indigo-700',
  'Transaction Won':                      'bg-green-50 text-green-700',
}
