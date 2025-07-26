import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SimulationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight">Simulación</h1>
      <div className="mt-4">{/* Aquí irá el contenido de la simulación */}</div>
    </div>
  );
}
