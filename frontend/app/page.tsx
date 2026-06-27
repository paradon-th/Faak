import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="w-full max-w-4xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-slate-900 dark:text-white">
          ฝากกระเป๋าไว้กับ <span className="text-blue-600">Faak</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          เดินทางตัวปลิว หมดกังวลเรื่องสัมภาระ ค้นหาสถานที่รับฝากกระเป๋าใกล้คุณได้ทันที ปลอดภัยและรวดเร็ว
        </p>

        <Card className="mx-auto max-w-2xl mt-8 shadow-xl bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle>ค้นหาสถานที่รับฝาก</CardTitle>
            <CardDescription>ระบุสถานที่ สถานีรถไฟฟ้า หรือย่านที่ต้องการฝาก</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="เช่น สยาม, อโศก, พญาไท..." 
                  className="pl-10 text-lg py-6"
                />
              </div>
              <Button type="submit" size="lg" className="py-6 px-8 text-lg bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-5 w-5" />
                ค้นหา
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
