import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  ArrowRight,
  ShoppingCart,
  Zap,
  Globe,
  MoreHorizontal,
} from "lucide-react";
import { StatsCard } from "../../components/StatsCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";

export const layout = "admin";

export const meta = {
  activeMenu: "dashboard",
  permission: ["admin", "user"],
  title: "Analytics Overview",
};

const transactions = [
  { name: "Alex Rivera", email: "alex@example.com", status: "Completed", amount: "$120.00", date: "2 hours ago" },
  { name: "Sarah Chen", email: "sarah@example.com", status: "Pending", amount: "$850.00", date: "5 hours ago" },
  { name: "James Wilson", email: "james@example.com", status: "Completed", amount: "$45.00", date: "Yesterday" },
  { name: "Maria Garcia", email: "maria@example.com", status: "Failed", amount: "$210.00", date: "Oct 24" },
  { name: "David Kim", email: "david@example.com", status: "Completed", amount: "$330.00", date: "Oct 23" },
];

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
  Completed: { variant: "default" },
  Pending: { variant: "secondary" },
  Failed: { variant: "destructive" },
};

export default function Dashboard(res) {
  console.log('dashboard', res)
  const stats = [
    { label: "Total Users", value: "2,543", trend: "+12.5%", isUp: true, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Revenue", value: "$45,231", trend: "+8.2%", isUp: true, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Avg. Session", value: "4m 32s", trend: "-2.4%", isUp: false, icon: Activity, color: "text-primary", bg: "bg-primary/10" },
    { label: "Conversion", value: "3.24%", trend: "+1.1%", isUp: true, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button size="sm">
            <Zap className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>You made 24 sales this week.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant={statusConfig[t.status]!.variant}>
                      {t.status}
                    </Badge>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold">{t.amount}</p>
                      <p className="text-[10px] text-muted-foreground">{t.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Info */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-border hover:border-primary/30 hover:bg-primary/5">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-xs">Add User</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-border hover:border-primary/30 hover:bg-primary/5">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="text-xs">New Order</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-border hover:border-primary/30 hover:bg-primary/5">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-xs">View Site</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-border hover:border-primary/30 hover:bg-primary/5">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-xs">Automation</span>
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-primary/5 border-primary/20 shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">System Healthy</p>
                  <p className="text-xs text-muted-foreground">All services operational</p>
                </div>
                <div className="ml-auto">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const getServerSide = async () => {
  console.log(" getServerSideDashboard")
  return {
    message: "This data came from the server!qweqwewqe",
    timestamp: new Date().toISOString()
  };
};