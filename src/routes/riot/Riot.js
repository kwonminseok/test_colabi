import React, {useState} from 'react'
import axios from 'axios';
import _ from 'lodash';

const RiotHttp ='https://kr.api.riotgames.com'
const API = 'api_key=RGAPI-142ecb4c-fc0f-4995-b7a1-daef7c4184e2'

const Riot = () =>{
    const [inputs, setInputs] = useState({
        userName: ''
    })
    const [champMasterys, setChampMasterys] = useState([])

    const [summoners, setSummoners] = useState({
        accountId:"",
        id:"",
        name:"",
        puuid:"",
        profileIconId: 0,
        revisionDate:0,
        summonerLevel: 0
    })

    const {userName} = inputs;
    const {accountId, id, name, profileIconId, revisionDate,summonerLevel} = summoners;

    const generateMasterys = () =>{
        let count = 0;
        if(champMasterys.length){
        return _.map(champMasterys, item =>{
            count++;
            if(count<3){
            return (
                <div key={item.championId} style={{marginBottom:"10px"}}>
                    <div> championId: {item.championId}</div>
                    <div> championLevel : {item.championLevel}</div>
                    <div> championPoints : {item.championPoints}</div>
                    <div> championPointsSinceLastLevel: {item.championPointsSinceLastLevel}</div>
                    <div> championPointsUntilNextLevel: {item.championPointsUntilNextLevel}</div>
                    <div> chestGranted : {item.chestGranted}</div>
                    <div> lastPlayTime: {item.lastPlayTime}</div>
                </div>
            )
            }
        })
    }
}
    const account = async(gameName) =>{
        const tag = `/riot/account/v1/accounts/by-puuid/{puuid}`
    }

    const champV3 = async()=>{
        const tag = '/lol/platform/v3/champion-rotations?'+API;

        axios
        .get(tag)
        .then(response =>{
            console.log(response)
        })
    }

    const champMastery = async() =>{
        const tag =`/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?`+API;

        axios
        .get(tag)
        .then(response =>{
            console.log(response)
            setChampMasterys(response.data);
        })

    }

    const summonerV4 = async() =>{
        const tag = `/lol/summoner/v4/summoners/by-name/${userName}?`+API;
        axios
        .get(tag)
        .then(response =>{
            console.log(response)
            if(response.status === 200){
                setSummoners({
                    accountId: response.data.accountId,
                    id: response.data.id,
                    name: response.data.name,
                    profileIconId: response.data.profileIconId,
                    revisionDate: response.data.revisionDate,
                    summonerLevel: response.data.summonerLevel
                })
            }
        })
    }

    const handleChange = (e) =>{
        const {name,value} = e.target;

        console.log(name,value);
        setInputs({
            ...inputs,
            [name]: value
        })

    }






    return (
        <>
        <button onClick={champV3}>CHAMP V3</button>
        <div>
            <button onClick={summonerV4}>SUMMONER V4</button>
            <input  type='text' name='userName' value={userName} onChange={handleChange}></input>
        </div>
        {accountId !==''?
            <>
            <div>
                <div> AccountId : {accountId}</div>
                <div> Id : {id}</div>
                <div> Name : {name}</div>
                <div> profileIconId : {profileIconId}</div>
                <div> revisionDate : {revisionDate}</div>
                <div> summonerLevel : {summonerLevel}</div>
            </div>
            <div>
              <button onClick={champMastery}>champMastery</button>
                {generateMasterys()}
            </div>
            </>:<></>}
        <div>

        </div>
        
        </>
    )
}

export default Riot;