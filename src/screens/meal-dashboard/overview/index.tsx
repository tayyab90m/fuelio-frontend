import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { ClipboardList, Users, UtensilsCrossed } from "lucide-react";
import illu1 from "../../../assets/images/illu4.svg";

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    {
      imageUrl: illu1,
    },
    {
      title: "Active Meal Plans",
      value: "245",
      icon: UtensilsCrossed,
      description: "Active meal plans this month",
      bgColor: "bg-primary",
      textColor: "text-white",
    },
    {
      title: "Total Recipes",
      value: "1,234",
      icon: ClipboardList,
      description: "Recipes in database",
      bgColor: "bg-secondary",
      textColor: "text-white",
    },
    {
      title: "Active Clients",
      value: "892",
      icon: Users,
      description: "Total active subscribers",
      bgColor: "bg-primary",
      textColor: "text-white",
    },
  ];

  const tabs = [
    { id: 0, label: 'Due to regenerate', data: homeData },
    { id: 1, label: 'Failed to generate', data: aboutData },
    { id: 2, label: 'Generated', data: servicesData },
    { id: 3, label: 'Activated', data: contactData },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-5">
        {/* Dashboard Overview */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor your business metrics and client activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid shadow gap-3 bg-white items-center px-10 rounded-lg md:grid-cols-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return stat.imageUrl ? (
              <div key={index}>
                <img
                  src={stat.imageUrl}
                  alt="stat"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Card
                className={`shadow-none border-none ${stat.bgColor}`}
                key={stat.title}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                  <p className={`text-xs ${stat.textColor}`}>{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs and Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Client Management</CardTitle>
            <CardDescription>
              View and manage your client data across different states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex space-x-2 border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Expires In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabs[activeTab].data.map((item) => (
                      <TableRow key={item.email}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.expiredIn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


const homeData = [
  { name: 'Thomas Anderson', email: 'thomas.anderson@example.com', expiredIn: '2025-01-10' },
  { name: 'William Moore', email: 'william.moore@example.com', expiredIn: '2025-01-12' },
  { name: 'Sandra Hernandez', email: 'sandra.hernandez@example.com', expiredIn: '2025-01-15' },
  { name: 'Charles Sanchez', email: 'charles.sanchez@example.com', expiredIn: '2025-01-18' },
  { name: 'James Lewis', email: 'james.lewis@example.com', expiredIn: '2025-01-20' },
  { name: 'Matthew Gonzalez', email: 'matthew.gonzalez@example.com', expiredIn: '2025-01-22' },
  { name: 'Elizabeth Johnson', email: 'elizabeth.johnson@example.com', expiredIn: '2025-01-25' },
  { name: 'Daniel Taylor', email: 'daniel.taylor@example.com', expiredIn: '2025-01-28' },
  { name: 'Jessica Jackson', email: 'jessica.jackson@example.com', expiredIn: '2025-01-30' },
  { name: 'Susan Harris', email: 'susan.harris@example.com', expiredIn: '2025-02-01' },
  { name: 'Margaret Miller', email: 'margaret.miller@example.com', expiredIn: '2025-02-03' },
];

const aboutData = [
  { name: 'John Harris', email: 'john.harris@example.com', expiredIn: '2025-02-20' },
  { name: 'Donald Garcia', email: 'donald.garcia@example.com', expiredIn: '2025-02-22' },
  { name: 'Richard Moore', email: 'richard.moore@example.com', expiredIn: '2025-02-25' },
  { name: 'David Robinson', email: 'david.robinson@example.com', expiredIn: '2025-02-28' },
  { name: 'Christopher Miller', email: 'christopher.miller@example.com', expiredIn: '2025-03-02' },
  { name: 'Elizabeth Ramirez', email: 'elizabeth.ramirez@example.com', expiredIn: '2025-03-05' },
  { name: 'Christopher Hernandez', email: 'christopher.hernandez@example.com', expiredIn: '2025-03-08' },
];

const servicesData = [
  { name: 'Sandra Ramirez', email: 'sandra.ramirez@example.com', expiredIn: '2025-02-05' },
  { name: 'Elizabeth Jones', email: 'elizabeth.jones@example.com', expiredIn: '2025-02-07' },
  { name: 'Sarah Brown', email: 'sarah.brown@example.com', expiredIn: '2025-02-10' },
  { name: 'Betty Harris', email: 'betty.harris@example.com', expiredIn: '2025-02-12' },
  { name: 'Daniel Martinez', email: 'daniel.martinez@example.com', expiredIn: '2025-02-15' },
  { name: 'Sarah Gonzalez', email: 'sarah.gonzalez@example.com', expiredIn: '2025-02-18' },
];

const contactData = [
  { name: 'Christopher Gonzalez', email: 'christopher.gonzalez@example.com', expiredIn: '2025-03-10' },
  { name: 'David Perez', email: 'david.perez@example.com', expiredIn: '2025-03-12' },
  { name: 'Margaret Thomas', email: 'margaret.thomas@example.com', expiredIn: '2025-03-15' },
  { name: 'Anthony Martin', email: 'anthony.martin@example.com', expiredIn: '2025-03-18' },
  { name: 'John Wilson', email: 'john.wilson@example.com', expiredIn: '2025-03-20' },
  { name: 'Betty Clark', email: 'betty.clark@example.com', expiredIn: '2025-03-25' },
];

export default App;