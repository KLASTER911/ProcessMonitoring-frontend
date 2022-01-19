import React, { Component } from 'react';
import './index.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,Legend} from 'recharts';

const port = 3030;
const host ="http://192.168.0.218";
const url = `${host}:${port}`;
class ProcessTable extends Component {
    constructor() {
        super();
        this.state = {
            services: null
        }
    }
    
    componentDidMount(){
        this.updateServiceData();
        setInterval(()=>{this.updateServiceData()}, 30000)
        
    }

    async updateServiceData(){
        let servicesList = {};
        let services = await this.getServicesList();
        for (let service of services){
            let serviceInfo = await this.infoService(service);
            servicesList[service] = {'data':serviceInfo.info[0]}
        }
        this.setState({services:servicesList});
        console.log(this.state)
    }

    async getServicesList() {      
        let reqServiceList = await fetch(`${url}\\getList`, { method: 'GET' })
        let json = await reqServiceList.json();
        return json;}

    async startAllServices(){
        console.log('start all services');
        for (let service in this.state.services){
            await this.startService(service);
        }
    }
    async stopAllServices(){
        console.log('stop all services');
        for (let service in this.state.services){
            await this.stopService(service);
        }
    }
    async restartAllServices(){            
        console.log('restart all services');
        for (let service in this.state.services){
            await this.restartService(service);
        }
    }
    
    startService(name){
        let startService = fetch(`${url}\\service\\${name}\\start`,{method:'POST'})
                            .then(response=>response.text())
                            .then(data=> {console.log(data);this.updateServiceData()})
                            .catch(error=> {console.log('error', error)})
        console.log(startService);
    }

    stopService(name){
        let stopService = fetch(`${url}\\service\\${name}\\stop`, { method: 'POST' })
            .then(response => response.text())
            .then(data => { console.log(data);this.updateServiceData() })
            .catch(error => { console.log('error', error) })
        console.log(stopService);
    }

    restartService(name) {
        let restartService = fetch(`${url}\\service\\${name}\\restart`, { method: 'POST' })
            .then(response => response.text())
            .then(data => { console.log(data);this.updateServiceData() })
            .catch(error => { console.log('error', error) })
        //console.log(restartService);
    }

    async infoService(name) {
        let infoService = await fetch(`${url}\\service\\${name}\\getInfo`, { method: 'GET' })
        let json = await infoService.json();
        console.log(json)
        return json;
    }
    
    tableStrings(){
        if (this.state.services) {
            let tableStrings = [];
            let i = 0;
            for (const [serviceName, value] of Object.entries(this.state.services)) {
                //console.log(`${serviceName}: ${value.data.status}`);
              
                var tbStr = (
                    <tr key={i}>
                        <td>{i}</td>
                        <td>{serviceName}</td>
                        <td style={{ color: value.data.status === 'stopped' ? 'red' : 'green' }}>{value.data.status}</td>
                        <td><button class="btn mx-1 btn-outline-success" onClick={() => this.startService(serviceName)}>Запустить</button>
                            <button class="btn mx-1 btn-outline-danger" onClick={() => this.stopService(serviceName)}>Остановить</button>
                            <button class="btn mx-1 btn-outline-dark" onClick={() => this.restartService(serviceName)}>Перезапустить</button></td>
                    </tr>)
                tableStrings.push(tbStr);
//                console.log(i,tableStrings);
                i = i + 1;
            }
//            console.log("tableS1",tableStrings)
            return tableStrings;
        }
        else{
//            console.log(false);
            return [<h1>load</h1>];
        }

    }

    render(){
        return(
        <div className = 'tb posleft'>
            <table className="table table-bordered">
                <thead className='thead-dark'>
                    <tr>
                        <th>№</th>
                        <th>NodeName</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.tableStrings()}
                </tbody>
        </table>    
                <button class="btn mx-1 btn-outline-success" onClick = {()=> this.startAllServices()}>Запустить ноды</button>
                <button class="btn mx-1 btn-outline-danger" onClick = {()=> this.stopAllServices()}>Остановить ноды</button>
                <button class="btn mx-1 btn-outline-dark"  onClick = {()=> this.restartAllServices()}>Перезапустить ноды</button>
                <button class="btn mx-1 btn-outline-primary" onClick = {()=>this.getServicesList()}>Обновить статусы нод</button>
        </div>)
        }
    }

export default ProcessTable;
