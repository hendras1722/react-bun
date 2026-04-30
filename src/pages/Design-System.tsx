import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "../components/ui/Breadcrumb";
import { Mail, Plus, Shield, Info, CheckCircle, AlertTriangle } from "lucide-react";

export const layout = "admin";

export const meta = {
  activeMenu: "design-system",
  title: "Design System",
};

export default function DesignSystem() {
  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Design System</h2>
        <p className="text-muted-foreground">Premium Shadcn-ui components running on Bun + React.</p>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Design System</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Buttons */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
          <Button disabled>Disabled</Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" /> With Icon
          </Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">Forms</h3>
        <div className="grid w-full items-center gap-1.5">
          <label htmlFor="email">Email</label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
      </section>

      {/* Avatars */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Avatars</h3>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Update</CardTitle>
              <CardDescription>Deploy your changes to production.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have 3 pending tasks that need to be reviewed before you can merge this pull request.
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy Now</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Currently disabled</p>
                </div>
                <Button size="sm">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
