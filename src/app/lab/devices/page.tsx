import { notFound } from 'next/navigation';
import DevicesLab from './DevicesLab';

export const metadata = { robots: { index: false, follow: false } };

/** Banco de pruebas visual de los equipos 3D (solo desarrollo). */
export default function DevicesLabPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <DevicesLab />;
}
