import ChampMeet from "@/components/ChampMeet";
import TeamRace from "@/components/TeamRace";
import ReceiptFactor from "@/components/receiptFactor/index";

const routes = [
    {path: '/', redirect: '/champions-meeting'},
    {path: '/champions-meeting', component: ChampMeet},
    {path: '/team-race', component: TeamRace},
    {path: '/receipt-factor', component: ReceiptFactor},
]

export default routes
