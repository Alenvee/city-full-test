import React, {Component} from 'react';
import {render} from 'react-dom';
import './style.css';


class App extends Component {
    constructor() {
        super();
        this.state = {
            cityList: [],
            value: null,
            usedZip: [],
            validation: false
        };
    }

    addSity = (ev) => {
        ev.preventDefault();
        const self = this;
        if (!this.state.usedZip.includes(this.state.value)) {
            this.setState({
                usedZip: [Number(this.state.value), ...this.state.usedZip],
            });
            fetch(`https://api.zippopotam.us/us/${this.state.value}`)
                .then(response => {
                    return response.json();
                })
                .then(res => {
                    const zip = Number(self.state.value);
                    const city = {...res.places[0], zip: zip};
                        this.setState({
                            cityList: [city, ...this.state.cityList],
                            value: '',
                            validation: false
                        });
                    }
                );

        }
        else {
            this.setState({
                validation: true
            });
        }
    };

    handleZip = (event) => {
        this.setState({
            value: Number(event.target.value)
        });
    };

    handleValueList = (event) => {
        const {target: {value}} = event;
        this.setState({
            value: value
        });
    };

    handleDelete = (value) => {
        const {cityList, usedZip} = this.state;
        this.setState({
            cityList: cityList.filter(item => item.zip !== value),
            usedZip: usedZip.filter(item => item !== value)
        });
    };


    render() {
        const {cityList, value, validation} = this.state;
        return (
            <div>
                <form onSubmit={this.addSity}>
                    <input type="text" value={value} onChange={this.handleZip}/>
                    <input type="submit" value="Go"/>
                    {validation && <div className='validation'>Dont use same zip twice</div>}
                </form>
                <ul>
                    {cityList.map((item, index) => <li
                        onClick={this.handleValueList}
                        value={item.zip}
                        key={`${index}-${item.state}`}>
                        {item['place name']}, {item['state abbreviation']}
                        {item.zip === value && <span> &#10004;</span>}
                        <span onClick={this.handleDelete.bind(this, item.zip)}> &#10008;</span>
                        </li>)}
                </ul>
                You can try:
                <ul>
                    <li>93454</li>
                    <li>93455</li>
                    <li>94105</li>
                    <li>12345</li>
                    <li>91325</li>
                    <li>90210</li>
                </ul>
            </div>
        );
    }
}

render(<App/>, document.getElementById('root'));
