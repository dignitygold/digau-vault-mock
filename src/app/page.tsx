"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Lock,
  Coins,
  Timer,
  ArrowDownToLine,
  Gavel,
  AlertTriangle,
  ShieldCheck,
  CircleDollarSign,
  ListChecks,
  ArrowRight,
  User,
  ExternalLink,
} from "lucide-react";

function fmt(n: number, dp = 0) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

function shortAddr(a: string) {
  return a.slice(0, 6) + "…" + a.slice(-4);
}

type ReqStatus = "None" | "Pending" | "Executed";
type ActiveTab = "user" | "journey" | "admin";

export default function Page() {
  // Mock wallet
  const [connected, setConnected] = useState(true);
  const wallet = "0x8B3C1a9d2F1b2aC6c9d0E3F4aB1cD2eF3a4B5c6D";

  // Mock balances
  const [walletBal] = useState(18200);
  const [staked, setStaked] = useState(12500);

  // ✅ From your CMC screenshot
  const [price] = useState(3.24);
  const [chg24h] = useState(-39.04);

  // Vault credits
  const [credits, setCredits] = useState(83220);
  const [daysStaked, setDaysStaked] = useState(30);

  // Actions
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("2500");
  const [reqStatus, setReqStatus] = useState<ReqStatus>("None");

  // Tabs
  const [tab, setTab] = useState<ActiveTab>("user");

  // Admin (mock)
  const isAdmin = true;

  const creditsPerDay = useMemo(() => Math.floor(staked * 0.22), [staked]);
  const walletValue = useMemo(() => walletBal * price, [walletBal, price]);
  const stakedValue = useMemo(() => staked * price, [staked, price]);

  const milestoneTarget = 100000;
  const milestonePct = Math.min(
    100,
    Math.round((credits / milestoneTarget) * 100)
  );

  function mockDeposit() {
    const amt = Number(depositAmount || 0);
    if (!amt || amt <= 0) return;
    setStaked((s) => s + amt);
    setCredits((c) => c + Math.floor(amt * 3));
    setDepositAmount("");
  }

  function requestWithdraw() {
    if (reqStatus !== "None") return;
    setReqStatus("Pending");
  }

  function adminExecuteWithdraw() {
    const amt = Math.min(Number(withdrawAmount || 0), staked);
    if (!amt || amt <= 0) return;

    setStaked((s) => Math.max(0, s - amt));
    setCredits(0);
    setDaysStaked(0);
    setReqStatus("Executed");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            {/* ✅ Logo in circle, NO border */}
            <div className="relative h-10 w-10 rounded-full bg-neutral-900 overflow-hidden shrink-0">
              <Image
                src="/digau-logo.png"
                alt="DIGau"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                DIGau Vault Console
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-snug">
                Secure vault operations & mining output eligibility
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              Ethereum · Live
            </Badge>

            {connected ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-neutral-900 text-neutral-200 border border-neutral-800"
                >
                  <User className="h-3.5 w-3.5 mr-1" />
                  {shortAddr(wallet)}
                </Badge>

                {/* ✅ Subtle, readable Disconnect */}
                <Button
                  variant="outline"
                  className="border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={() => setConnected(false)}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                className="bg-yellow-500 text-black hover:bg-yellow-400"
                onClick={() => setConnected(true)}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </motion.div>

        {/* Price row */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-300 flex-wrap">
              <CircleDollarSign className="h-4 w-4 text-yellow-500" />
              <span className="text-neutral-400">DIGau Price (CMC)</span>
              <span className="font-semibold text-neutral-100">${fmt(price, 2)}</span>
              <span className={chg24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                {chg24h >= 0 ? "+" : ""}
                {fmt(chg24h, 2)}%
              </span>

              <a
                href="https://coinmarketcap.com/currencies/dignity-gold/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 ml-1"
              >
                View on CMC <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2 text-xs text-neutral-400">
              <span className="px-2 py-1 rounded-md border border-neutral-800 bg-neutral-900">
                Wallet: <span className="text-neutral-200">${fmt(walletValue, 0)}</span>
              </span>
              <span className="px-2 py-1 rounded-md border border-neutral-800 bg-neutral-900">
                Vault: <span className="text-neutral-200">${fmt(stakedValue, 0)}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Coins className="h-4 w-4 text-yellow-500" /> DIGau Balance
              </CardTitle>
              <CardDescription>Available in wallet</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">{fmt(walletBal)} DIGau</div>
              <div className="text-sm text-neutral-400">≈ ${fmt(walletValue, 0)} USD</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4 text-yellow-500" /> Vault Locked
              </CardTitle>
              <CardDescription>Deposited into vault</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">{fmt(staked)} DIGau</div>
              <div className="text-sm text-neutral-400">{daysStaked} days active</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="h-4 w-4 text-yellow-500" /> Vault Credits
              </CardTitle>
              <CardDescription>Mining output eligibility</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              <div className="text-2xl font-bold">{fmt(credits)}</div>
              <div className="text-sm text-neutral-400">+{fmt(creditsPerDay)} / day</div>
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span>Milestone: {fmt(milestoneTarget)} credits</span>
                  <span>{milestonePct}%</span>
                </div>
                <Progress value={milestonePct} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-yellow-500" /> Current Asset
              </CardTitle>
              <CardDescription>Gold exposure token</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold">DIGau (Gold)</div>
                <div className="text-xs text-neutral-400">Vault-eligible</div>
              </div>
              <Badge className="bg-yellow-500 text-black">Active</Badge>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4 text-yellow-500" /> Future Output
              </CardTitle>
              <CardDescription>Silver ecosystem token</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold">DIGag (Silver)</div>
                <div className="text-xs text-neutral-400">Claim window later</div>
              </div>
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4 text-yellow-500" /> Future Output
              </CardTitle>
              <CardDescription>Platinum ecosystem token</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold">DIGpt (Platinum)</div>
                <div className="text-xs text-neutral-400">TBA</div>
              </div>
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:block">
          <Tabs value={tab} onValueChange={(v) => setTab(v as ActiveTab)} className="space-y-3">
            <TabsList>
              <TabsTrigger value="user">User Console</TabsTrigger>
              <TabsTrigger value="journey">User Journey</TabsTrigger>
              <TabsTrigger value="admin" disabled={!isAdmin}>
                Admin Console
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-neutral-950 border-neutral-800">
                  <CardHeader>
                    <CardTitle>Deposit to Vault</CardTitle>
                    <CardDescription>
                      Lock DIGau into the vault to accumulate credits for future ecosystem output.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Amount of DIGau"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                    <div className="text-xs text-neutral-400">
                      Estimated:{" "}
                      <span className="text-neutral-200">
                        {fmt(Math.floor(Number(depositAmount || 0) * 0.22))}
                      </span>{" "}
                      credits/day for this deposit (mock)
                    </div>
                    <Button
                      className="bg-yellow-500 text-black hover:bg-yellow-400"
                      onClick={mockDeposit}
                      disabled={!connected}
                    >
                      <ArrowDownToLine className="h-4 w-4 mr-2" />
                      Deposit to Vault
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-neutral-800">
                  <CardHeader>
                    <CardTitle>Request Withdrawal</CardTitle>
                    <CardDescription>
                      Requires admin approval. If executed, you forfeit all vault credits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-yellow-400">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      Withdrawing early burns all accumulated vault credits.
                    </div>
                    <Input
                      placeholder="Amount to withdraw"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      {reqStatus === "None" && (
                        <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                          Status: Ready
                        </Badge>
                      )}
                      {reqStatus === "Pending" && (
                        <Badge className="bg-yellow-500 text-black">
                          Status: Pending Admin
                        </Badge>
                      )}
                      {reqStatus === "Executed" && (
                        <Badge className="bg-emerald-500 text-black">
                          Status: Executed
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      onClick={requestWithdraw}
                      disabled={!connected || reqStatus !== "None"}
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Submit Withdrawal Request
                    </Button>

                    <div className="text-xs text-neutral-500">
                      Admin executes the transfer from the vault contract after review.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="journey">
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle>Vault User Journey</CardTitle>
                  <CardDescription>How the vault works</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-neutral-300">
                  {[
                    ["Connect Wallet", "Connect an Ethereum wallet holding DIGau. See balance + USD value."],
                    ["Deposit to Vault", "Approve DIGau and deposit into the Vault Contract."],
                    ["Accumulate Credits", "Credits rise over time and determine future ecosystem allocations."],
                    ["Request Withdrawal", "Submit withdrawal request. Status becomes Pending Admin."],
                    ["Admin Executes", "Admin transfers principal back. Credits are forfeited on execution."],
                  ].map(([t, d]) => (
                    <div key={t} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <div className="font-semibold text-neutral-100">{t}</div>
                        <div className="text-neutral-400">{d}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-neutral-950 border-neutral-800">
                  <CardHeader>
                    <CardTitle>Withdrawal Queue</CardTitle>
                    <CardDescription>Admin executes transfers (mock)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm min-w-0">
                          <div className="font-semibold text-neutral-100">{shortAddr(wallet)}</div>
                          <div className="text-xs text-neutral-400">
                            Requested: {withdrawAmount} DIGau · Credits to forfeit: {fmt(credits)}
                          </div>
                        </div>
                        <Badge
                          className={
                            reqStatus === "Pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-neutral-800 text-neutral-200"
                          }
                        >
                          {reqStatus === "Pending" ? "Pending" : "No Request"}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      className="bg-yellow-500 text-black hover:bg-yellow-400"
                      onClick={adminExecuteWithdraw}
                      disabled={reqStatus !== "Pending"}
                    >
                      Execute Transfer & Forfeit Credits
                    </Button>

                    <div className="text-xs text-neutral-500">
                      Admin transfers principal back and resets vault credits to zero.
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-neutral-800">
                  <CardHeader>
                    <CardTitle>Admin Controls</CardTitle>
                    <CardDescription>Operational controls (mock)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-neutral-300">
                    <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900">
                      <div className="font-semibold text-neutral-100">Policy</div>
                      <div className="text-neutral-400 text-xs">
                        Withdrawals are manually reviewed. Executed withdrawals burn all accumulated credits by design.
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900">
                      <div className="font-semibold text-neutral-100">Audit Trail</div>
                      <div className="text-neutral-400 text-xs">
                        Every request and execution emits events for transparent reporting.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ✅ Mobile content + sticky bottom nav */}
        <div className="sm:hidden pb-24">
          {tab === "user" && (
            <div className="space-y-3">
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle>Deposit to Vault</CardTitle>
                  <CardDescription>
                    Lock DIGau into the vault to accumulate credits for future ecosystem output.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Amount of DIGau"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <div className="text-xs text-neutral-400">
                    Estimated:{" "}
                    <span className="text-neutral-200">
                      {fmt(Math.floor(Number(depositAmount || 0) * 0.22))}
                    </span>{" "}
                    credits/day (mock)
                  </div>
                  <Button
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                    onClick={mockDeposit}
                    disabled={!connected}
                  >
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    Deposit to Vault
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle>Request Withdrawal</CardTitle>
                  <CardDescription>
                    Requires admin approval. If executed, you forfeit all vault credits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-yellow-400">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    Withdrawing early burns all accumulated vault credits.
                  </div>
                  <Input
                    placeholder="Amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    {reqStatus === "None" && (
                      <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                        Status: Ready
                      </Badge>
                    )}
                    {reqStatus === "Pending" && (
                      <Badge className="bg-yellow-500 text-black">Status: Pending Admin</Badge>
                    )}
                    {reqStatus === "Executed" && (
                      <Badge className="bg-emerald-500 text-black">Status: Executed</Badge>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={requestWithdraw}
                    disabled={!connected || reqStatus !== "None"}
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Submit Withdrawal Request
                  </Button>
                  <div className="text-xs text-neutral-500">
                    Admin executes the transfer from the vault contract after review.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "journey" && (
            <Card className="bg-neutral-950 border-neutral-800">
              <CardHeader>
                <CardTitle>Vault Journey</CardTitle>
                <CardDescription>How it works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-300">
                {[
                  ["Connect Wallet", "Connect an Ethereum wallet holding DIGau. See balance + USD value."],
                  ["Deposit to Vault", "Approve DIGau and deposit into the Vault Contract."],
                  ["Accumulate Credits", "Credits rise over time and determine future ecosystem allocations."],
                  ["Request Withdrawal", "Submit withdrawal request. Status becomes Pending Admin."],
                  ["Admin Executes", "Admin transfers principal back. Credits are forfeited on execution."],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <div className="font-semibold text-neutral-100">{t}</div>
                      <div className="text-neutral-400">{d}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {tab === "admin" && (
            <Card className="bg-neutral-950 border-neutral-800">
              <CardHeader>
                <CardTitle>Admin Queue</CardTitle>
                <CardDescription>Execute withdrawals (mock)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm min-w-0">
                      <div className="font-semibold text-neutral-100">{shortAddr(wallet)}</div>
                      <div className="text-xs text-neutral-400">
                        Requested: {withdrawAmount} DIGau · Credits to forfeit: {fmt(credits)}
                      </div>
                    </div>
                    <Badge
                      className={
                        reqStatus === "Pending"
                          ? "bg-yellow-500 text-black"
                          : "bg-neutral-800 text-neutral-200"
                      }
                    >
                      {reqStatus === "Pending" ? "Pending" : "No Request"}
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                  onClick={adminExecuteWithdraw}
                  disabled={reqStatus !== "Pending"}
                >
                  Execute Transfer & Forfeit Credits
                </Button>

                <div className="text-xs text-neutral-500">
                  Admin transfers principal back and resets vault credits to zero.
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ✅ Sticky bottom nav for mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              className={
                tab === "user"
                  ? "flex-1 bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-400"
                  : "flex-1 border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
              }
              onClick={() => setTab("user")}
            >
              User
            </Button>
            <Button
              variant="outline"
              className={
                tab === "journey"
                  ? "flex-1 bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-400"
                  : "flex-1 border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
              }
              onClick={() => setTab("journey")}
            >
              Journey
            </Button>
            <Button
              variant="outline"
              className={
                tab === "admin"
                  ? "flex-1 bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-400"
                  : "flex-1 border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
              }
              onClick={() => setTab("admin")}
              disabled={!isAdmin}
            >
              Admin
            </Button>
          </div>
        </div>

        <div className="text-xs text-neutral-500 hidden sm:block">
          Vault credits determine eligibility for future Dignity ecosystem assets (e.g., silver, platinum). No immediate token emissions.
        </div>
      </div>
    </main>
  );
}
