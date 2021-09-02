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
            items: []
        }
    }
    
    componentDidMount(){
        this.getStatuses()
        setInterval(()=>this.getStatuses(),5000)
    }
    getStatuses(){
        let response = fetch(`${url}\\data`,{method:'GET'})
        .then((response) => response.json())
        .then((response) => {
            this.setState({items:response})
            console.log('response',response);
        })
        console.log('state:',this.state.items)
    }
    manageNode(body) {
        console.log('body',body)
        fetch(`${url}\\data`, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(body), // данные могут быть 'строкой' или {объектом}!
        headers: {'Content-Type': 'application/json'},
        });
            }
    allProcessJSON(action){
        let body = [];
        this.state.items.forEach(element=>{
            body.push({'process':element.process,'action':action})
        })
        return body
    }
    getProcData(ProcData){
        var data = [
            {name: 'Page A', uv: 4000},
            {name: 'Page B', uv: 3000},
            {name: 'Page C', uv: 2000},
            {name: 'Page D', uv: 2780},
            {name: 'Page E', uv: 1890},
      ];
      const data2 = [
            {name: 'Page A', pv: 2400, amt: 2400},
            {name: 'Page B', pv: 1398, amt: 2210},
            {name: 'Page C', pv: 9800, amt: 2290},
            {name: 'Page D', pv: 3908, amt: 2000},
      ];
        const renderLineChart = (
            <LineChart width={600} height={300} 
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line data={data} type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{r: 8}}/>
      </LineChart>
        )
                        return renderLineChart;
    }

    
    tbString(item,index){
        var tbStr = (
        <tr key={index}>
            <td>{index+1}</td>
            <td>{item.process}</td>
            <td style={{ color: item.status === 'stopped'? 'red':'green' }}>{item.status}</td>
            <td><button class="btn mx-1 btn-outline-success" onClick = {()=>this.manageNode([{'process':String(item.process), 'action':"start"}])}>Запустить</button>
            <button class="btn mx-1 btn-outline-danger" onClick = {()=>this.manageNode([{'process':String(item.process), 'action':"stop"}])}>Остановить</button>
            <button class="btn mx-1 btn-outline-dark" onClick = {()=>this.manageNode([{'process':String(item.process), 'action':"restart"}])}>Перезапустить</button></td>
        </tr>)

        return tbStr
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
                    {this.state.items.map((item, index) =>(
                        this.tbString(item,index)
                    ))}
                </tbody>
        </table>    
                <button class="btn mx-1 btn-outline-success" onClick = {()=> this.manageNode(this.allProcessJSON('start'))}>Запустить ноды</button>
                <button class="btn mx-1 btn-outline-danger" onClick = {()=> this.manageNode(this.allProcessJSON('stop'))}>Остановить ноды</button>
                <button class="btn mx-1 btn-outline-dark"  onClick = {()=> this.manageNode(this.allProcessJSON('restart'))}>Перезапустить ноды</button>
                <button class="btn mx-1 btn-outline-primary" onClick = {()=>this.getStatuses()}>Обновить статусы нод</button>
        <div>{this.getProcData()}</div>
        </div>)
        }
    }
    
export default ProcessTable;
