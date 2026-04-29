import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Mail,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar, AvatarFallback } from "../../components/ui/Avatar";
import { Input } from "../../components/ui/Input";
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
  activeMenu: "users",
  title: "User Management",
};

const users = [
  { id: 1, name: "Alex Rivera", email: "alex@example.com", role: "Admin", status: "Active", joined: "Jan 12, 2024" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "Editor", status: "Active", joined: "Feb 3, 2024" },
  { id: 3, name: "James Wilson", email: "james@example.com", role: "Viewer", status: "Inactive", joined: "Mar 18, 2024" },
  { id: 4, name: "Maria Garcia", email: "maria@example.com", role: "Editor", status: "Active", joined: "Apr 1, 2024" },
  { id: 5, name: "David Kim", email: "david@example.com", role: "Admin", status: "Suspended", joined: "Apr 20, 2024" },
  { id: 6, name: "Emma Johnson", email: "emma@example.com", role: "Viewer", status: "Active", joined: "May 5, 2024" },
];

const roleConfig: Record<string, { icon: any; variant: "default" | "secondary" | "outline" }> = {
  Admin: { icon: Shield, variant: "default" },
  Editor: { icon: Mail, variant: "secondary" },
  Viewer: { icon: Users, variant: "outline" },
};

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
  Active: { variant: "default" },
  Inactive: { variant: "secondary" },
  Suspended: { variant: "destructive" },
};

export default function UsersIndex() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-primary/5 border-primary/10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Users</p>
              <p className="text-xl font-bold">2,543</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Now</p>
              <p className="text-xl font-bold">1,204</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Suspended</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div className="space-y-1">
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage your team members and their roles.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b">
                  <th className="pb-4 pl-0 font-medium">User</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Joined</th>
                  <th className="pb-4 text-right pr-0 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-accent/30 transition-colors">
                    <td className="py-4 pl-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = roleConfig[user.role]!.icon;
                          return <Icon className="h-3.5 w-3.5 text-muted-foreground" />;
                        })()}
                        <span className="text-sm">{user.role}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={statusConfig[user.status]!.variant}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {user.joined}
                    </td>
                    <td className="py-4 text-right pr-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <div className="p-6 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing 6 of 2,543 users</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}