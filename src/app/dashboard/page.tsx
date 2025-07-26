import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, MessageSquare, TrendingUp } from 'lucide-react';

// Aquí irá tu llamada a Prisma cuando la tengas configurada
// import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // TODO: Descomentar cuando tengas Prisma configurado
  // const sessions = await prisma.session.findMany({
  //   where: { userId },
  //   orderBy: { createdAt: 'desc' },
  //   take: 10
  // });

  // Datos mock para mostrar la interfaz
  const sessions = [
    {
      id: '1',
      title: 'Simulación de Objeciones',
      duration: 12,
      ended: true,
      createdAt: new Date('2024-01-20'),
      feedback: { score: 85 },
    },
    {
      id: '2',
      title: 'Práctica de Cierre',
      duration: 8,
      ended: true,
      createdAt: new Date('2024-01-19'),
      feedback: { score: 92 },
    },
  ];

  const completedSessions = sessions.filter((s) => s.ended).length;
  const averageScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((acc, s) => acc + (s.feedback?.score || 0), 0) /
            sessions.length,
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Entrena tus habilidades de venta con simulaciones de IA
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/new-session">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Simulación
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Completadas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((acc, s) => acc + (s.duration || 0), 0)} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones Recientes</CardTitle>
          <CardDescription>
            Tus últimas simulaciones de entrenamiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Aún no tienes sesiones de entrenamiento
              </p>
              <Button asChild>
                <Link href="/dashboard/new-session">
                  Crear tu primera simulación
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">
                        {session.title || `Sesión ${session.id}`}
                      </h3>
                      {session.ended && (
                        <Badge variant="secondary">Completada</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration} min
                      </span>
                      <span>
                        {session.createdAt.toLocaleDateString('es-ES')}
                      </span>
                      {session.feedback?.score && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {session.feedback.score}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/${session.id}`}>Ver Detalles</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
