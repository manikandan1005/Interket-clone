"use client";
import { CiMenuKebab } from "react-icons/ci";
import AgentList from "./AgentList";
import CreateAgent from "./CreateAgent";
import { useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { LuHeadset } from "react-icons/lu";
import { BsFillSearchHeartFill } from "react-icons/bs";



function AgentSetting() {
    const permission = JSON.parse(localStorage.getItem("permission") as string)
    const name = "AgentSetting";
    const access = permission==="FULL_ACCESS"?{create:true,edit:true,delete:true,view:true}:permission.find((i:any) => i.screenName === name)
   
    // const [createAgent,setCreateAgent]=useState<any>()
    // const [agentAdded,setAgentAdded]=useState()
    const [createAgent, setCreateAgent] = useState(false)
    const [contactedAdded, SetContactedAdded] = useState<boolean>(false)

    const text = { head: "Manage Agents", description: "You can create different types of Agents and easily manage existing ones from here" }
    return (
        <div className="!py-5 !px-6 fixed top-15  left-13 right-0 flex min-h-screen  flex-col gap-6" >
            <div className="fixed! top-0! left-0! ">
                <CreateAgent createAgent={createAgent} setCreateAgent={setCreateAgent} contactedAdded={contactedAdded} SetContactedAdded={SetContactedAdded} />

            </div>
            {/* <CreateAgent setCreateAgent={setCreateAgent} createAgent={createAgent} ></CreateAgent> */}
            <div className="flex w-full    min-h-[30px] bg-green-700 lg:bg-gray-50 shadow-xl !p-3">
                {/* mobile nav */}
                <div className="flex flex-row sm:hidden w-full px-[20px] items-center justify-between p-4">
                    <div className="text-6xl font-bold text-white">
                        Agents
                    </div>
                    <CiMenuKebab className="text-white text-2xl" />
                </div>
                {/* full */}
                <div className="hidden md:flex w-full px-10   ">
                    <div className="flex w-full  items-center  gap-5">
                        <div >
                            <div className="h-20 flex items-center justify-center text-white bg-green-700 w-20 rounded-full "  >
                                <LuHeadset className="h-15 w-15" />
                            </div>
                        </div>
                        <div className="lg:w-3/4">
                            <h2>{text.head}</h2>
                            <p>{text.description}</p>
                        </div>
                    </div>
                    {access.create && <div className="flex w-full justify-end ">
                        <div className="flex items-center ">
                            <button onClick={() => { setCreateAgent(true) }} className=" flex items-center gap-4 bg-green-800! text-white! px-10! py-3! rounded">
                                <RiAddFill />
                                <span  >Create Agent</span>
                            </button>
                        </div>
                    </div>}
                </div>
            </div>

            <div className="flex w-full    bg-gray-50 items-center justify-center">
                <AgentList access={access}></AgentList>
            </div>
        </div>
    );
}
export default AgentSetting