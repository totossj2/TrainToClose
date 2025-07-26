import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600">
        ¡Bienvenido a tu dashboard!{' '}
        {session.userId
          ? `Tu ID es: ${session.userId}`
          : 'No estás autenticado'}
      </p>
    </div>
  );
}
