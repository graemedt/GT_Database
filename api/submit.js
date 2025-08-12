import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, address, city } = typeof req.body === 'object' ? req.body : {};

    const n = String(name || '').trim();
    const a = String(address || '').trim();
    const c = String(city || '').trim();

    if (!n || !a || !c) return res.status(400).json({ error: 'Missing fields' });
    if (n.length > 200 || a.length > 300 || c.length > 120) {
      return res.status(400).json({ error: 'Field too long' });
    }

    const { error } = await supabase.from('people').insert([{ name: n, address: a, city: c }]);
    if (error) throw error;

    return res.status(201).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected error' });
  }
}
