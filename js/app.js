(function () {


    //get new id key for item
    function generateID(data) {

        var hasInDB = []
        fetch('/users', {
            "method": "GET"
          })
            .then((response) => response.json())
            .then((responseData) => hasInDB =responseData)
         
            console
        var ID = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2, 3);
        ID = '5a6b0087' + ID;
        for (var index in data)
            if (data[index].id == ID || hasInDB.indexOf(ID)>-1)
                ID = generateID(data);
        return ID;
    }

    // set disabled/enabled state for input-item
    function createStates(data, states) {
        if (states.length == 0) {
            states = new Array(data.length);
            for (var i in data)
                states[i] = false;
        }
        return states;
    }


    //sort data in table (first click - by asc, after  - desc and repeat it)
    function sortDataInc(field, data, states, ascDescState) {

        var emptyData = [];
        var emptyStates = [];

        for (var i = 0; i < data.length; i++)
            if (data[i]['' + field] == '') {

                emptyData.push(data[i]);
                data.splice(i, 1);
                emptyStates.push(states[i]);
                states.splice(i, 1);
                i--;
            }

        if (field != '') {
            for (var i = 0; i < data.length; i++) {

                for (var j = i; j < data.length; j++) {

                    if (isNaN(data[i]['' + field]) || isNaN(data[j]['' + field])) {
                        if (data[i]['' + field].toLowerCase() < data[j]['' + field].toLowerCase()) {
                            var buf = data[i];
                            data[i] = data[j];
                            data[j] = buf;

                            buf = states[i];
                            states[i] = states[j];
                            states[j] = buf;

                        }
                    }
                    else {
                        if (data[i]['' + field] < data[j]['' + field]) {
                            var buf = data[i];
                            data[i] = data[j];
                            data[j] = buf;

                            buf = states[i];
                            states[i] = states[j];
                            states[j] = buf;
                        }
                    }
                }
            }

            var resultData;
            var resultStates;
            //console.log(resultStates);
            if (ascDescState == 1) {
                resultData = data.concat(emptyData);
                resultStates = states.concat(emptyStates);
            }
            else if (ascDescState == 2) {
                resultData = data.reverse().concat(emptyData);
                resultStates = states.reverse().concat(emptyStates)
            }

            return { TD: resultData, ST: resultStates };
        }
    }



    //There's component to  open and parse file:
    //readFile() - parsing adjusted JSON file; 
    // render () - representation table with data (or empty table with possibility to add data there) 
    //             from files (representation defines in TableList component );

    var App = React.createClass({

        getInitialState: function () {
            return {
                stateNow: 0,
                dataFromFile: []
            }
        },

        readFile: function (e) {
            e.preventDefault();

            var file = e.target.files[0];
            var reader = new FileReader();
            var self = this;

            reader.onload = function (e) {
                var jsonSTR = e.target.result.trim();

                var dataFromFile = JSON.parse(jsonSTR);
                //console.log(dataFromFile);
                self.setState({
                    stateNow: ++self.state.stateNow,
                    dataFromFile: dataFromFile
                });

            };
            reader.readAsText(file);
        },
   

        render: function () {

            return (
                <div className="app">
                    <form>
                    <input type="file" onClick={this.onCLick} onChange={this.readFile} className='browseButt'></input>
                    </form>
                    <TableList data={this.state.dataFromFile} flag={this.state.stateNow} />
                </div>

            );
        }
    });


    // Component to work with table-data:
    //addNewLine() - adding empty line to table (enable edit);
    //onChangeHandler() - handling changes in input-field;
    //onClickEdit() - enable/disable the possible of edit;
    //onClickDelete() - deleting current line from table;

    var TableList = React.createClass({

        getInitialState: function () {


            return {
                disabled: [],
                dataTable: null,
                sortState: [],
                startFlag: 0,
                result: [0, '', ''],
                errors: [],
                warnings: []
            }
        },

        onChangeHandler: function (e) {
            e.preventDefault();
            var targetRowID = e.target.parentNode.parentNode.getAttribute('data-reactid');
            var entryID = targetRowID.slice(targetRowID.indexOf('$') + 1);
            var dataTable = this.state.dataTable;
            var propName = e.target.className;
            var value = e.target.value;
            for (var numElem in dataTable) {

                if (dataTable[numElem].id == entryID) {
                    if (propName == 'age' && !isNaN(value))
                        dataTable[numElem][propName] = parseInt(value) || 0;

                    else if (propName != 'age')
                        dataTable[numElem][propName] = value;

                    console.log(dataTable[numElem]);
                }

            }

            this.setState({
                dataTable: dataTable
            });


        },

        addNewLine: function (e) {
            e.preventDefault();
            //console.log(this.props.data);
            var dataTable = this.state.dataTable || [];
            var disabled = createStates(dataTable, this.state.disabled);

            dataTable.push({
                id: generateID(dataTable),
                name: '',
                age: 1,
                gender: 'male',
                phone: '',
                company: '',
                email: '',
                address: ''
            });
            disabled[dataTable.length - 1] = true;
            //console.log(states);
            this.setState({
                disabled: disabled,
                dataTable: dataTable
            });
            //console.log(dataTable);
        },

        onCLickEdit: function (e) {
            e.preventDefault();
            var targetRowID = e.target.parentNode.parentNode.getAttribute('data-reactid');
            var entryID = targetRowID.slice(targetRowID.indexOf('$') + 1);
            var dataTable = this.state.dataTable;
            var disabled = this.state.disabled;

            for (var numElem in dataTable)
                if (dataTable[numElem].id == entryID)
                    disabled[numElem] = disabled[numElem] ? false : true;

            this.setState({ disabled: disabled });

        },

        onClickDelete: function (e) {
            e.preventDefault();
            var targetRowID = e.target.parentNode.parentNode.getAttribute('data-reactid');
            var entryID = targetRowID.slice(targetRowID.indexOf('$') + 1);
            var dataTable = this.state.dataTable;
            var disabled = createStates(dataTable, this.state.disabled);

            for (var numElem in dataTable)
                if (dataTable[numElem].id == entryID) {
                    dataTable.splice(numElem, 1);
                    disabled.splice(numElem, 1);
                }
            //console.log(dataTable);
            this.setState({
                disabled: disabled,
                dataTable: dataTable
            });
        },

        onClickHeader: function (e) {
            e.preventDefault();
            var target = e.target;
            var headers = document.getElementsByTagName('th');
            headers = [].slice.call(headers);
            var targetIndex = headers.indexOf(target) & headers.indexOf(target.parentNode);

            //define the className of header
            var className;
            if (headers.indexOf(target) > -1)
                className = target.className;
            else if (headers.indexOf(target.parentNode))
                className = target.parentNode.className;

            var sortState = this.state.sortState;
            if (sortState.length == 0) {
                sortState = Array(headers.length - 1);
                for (var index = 0; index < sortState.length; index++) {
                    sortState[index] = 0;
                }
            }

            if (targetIndex > -1)
                if (sortState[targetIndex] == 0 || sortState[targetIndex] == 2)
                    sortState[targetIndex] = 1;
                else if (sortState[targetIndex] == 1)
                    sortState[targetIndex] = 2;

            for (var index = 0; index < sortState.length; index++)
                if (index != targetIndex)
                    sortState[index] = 0;
            //console.log(sortState);
            //console.log(this.state.disabled + 'here');
            //console.log(sortState[targetIndex]);
            var sorted = sortDataInc(className, this.state.dataTable, 
                                    this.state.disabled, sortState[targetIndex]);

            this.setState({
                dataTable: sorted.TD,
                disabled: sorted.ST,
                sortState: sortState
            })

        },

        onSubmitHandler: function (e) {
            e.preventDefault();

            var validate = this.validator(this.state.dataTable);
            //console.log(validate.toSubmit);
            fetch('/users', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validate.toSubmit)
            }).then(function (response) {
                return response.json()
            }).then(function (body) {
                console.log(body);
            });

            self.setState({
                result: [1, 'success', 'records has been added and updated'],
                errors: validate.errors,
                warnings: validate.warnings
            });



        },

        validator: function (data) {
            var errors = [];
            var warnings = [];
            var toSubmit = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == '' || data[i].age < 0 || data[i].gender == '')
                    errors.push(data[i].id);
                else if (data[i].phone == '' || data[i].address == '' || data[i].company == '' || data[i].email == '') {
                    toSubmit.push(data[i])
                    warnings.push(data[i].id);
                }
                else toSubmit.push(data[i]);
            }

            return { errors: errors, warnings: warnings, toSubmit: toSubmit };

        },

        render: function () {
            //console.log(this.props.data);
            var dataToTable = this.state.dataTable || this.props.data;
            var isSubmit = false;
            var result = this.state.result;

            //console.log(this.state.result);

            if (this.state.result[0] != 0)
                this.state.result = [0, ''];

            var errors = this.state.errors;
            var warnings = this.state.warnings;


            // this.state.errors = this.state.warnings =[];

            //console.log(this.props.flag);
            //.. there's some crutch to change an initial state
            if (this.state.dataTable == null && this.props.data.length > 0) {
                //console.log(this.props.data);
                this.state.dataTable = this.props.data;
                
                dataToTable = this.state.dataTable;
                this.state.disabled = createStates(dataToTable, []);
                this.state.startFlag = this.props.flag;

            }
            else if (this.state.dataTable != null && this.props.flag > this.state.startFlag) {
                this.state.dataTable = this.props.data;
                dataToTable = this.state.dataTable;
                //console.log(this.props.flag+" "+this.state.startFlag);
                this.state.startFlag = this.props.flag;
                this.state.disabled = createStates(dataToTable, []);

            }

            if (dataToTable.length > 0)
                isSubmit = true;

            //console.log(this.state.sortState);
            //console.log(this.state.disabled);


            var dataTemp;
            self = this;
            if (dataToTable.length > 0) {
                //console.log(dataToTable);
                dataTemp = dataToTable.map(function (item, index) {

                    return (
                        <tr key={item.id} onChange={self.onChangeHandler} className={!self.state.disabled[index] ? "trDisabled" : ""} className={errors.indexOf(item.id) > -1 ? "hasErr" : '' || warnings.indexOf(item.id) > -1 ? "hasWarn" : ''}>
                            <td className='number'>{index + 1}</td>
                            <td><input type='text' value={item.name} className="name" disabled={!self.state.disabled[index]}> </input></td>
                            <td><input type='text' value={item.age} className="age" disabled={!self.state.disabled[index]}></input></td>
                            <td><select className='gender' value={item.gender} disabled={!self.state.disabled[index]}>
                                <option value='male' >{"male"}</option>
                                <option value='female' >{"female"}</option>
                            </select></td>

                            <td><input type='text' value={item.email} className="email" disabled={!self.state.disabled[index]}></input></td>
                            <td><input type='text' value={item.company} className="company" disabled={!self.state.disabled[index]}></input></td>
                            <td><input type='text' value={item.phone} className="phone" disabled={!self.state.disabled[index]}></input></td>
                            <td><input type='text' value={item.address} className="address" disabled={!self.state.disabled[index]} ></input></td>
                            <td className='action'><button className={!self.state.disabled[index] ? 'editButtIn' : 'editButtAc'} onClick={self.onCLickEdit}>Edit</button>
                                <button className='deleteButt' onClick={self.onClickDelete}>Delete</button>
                            </td>
                        </tr>
                    )
                }
                )
            };


            //to init states, cause there were [] before
            this.state.disabled = createStates(dataToTable, this.state.disabled);
            return (
                <div className="tableList">
                    <form onSubmit={this.onSubmitHandler}>
                        <table className="table">
                            <thead onClick={this.onClickHeader}>

                                <tr>
                                    <th className='number'>Num</th>
                                    <th className="name" >Name<a className={this.state.sortState[1] == 1 ? "arrow-top" : '' || this.state.sortState[1] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className="age">Age<a className={this.state.sortState[2] == 1 ? "arrow-top" : '' || this.state.sortState[2] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className='gender' >Gender<a className={this.state.sortState[3] == 1 ? "arrow-top" : '' || this.state.sortState[3] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className="email">Email<a className={this.state.sortState[4] == 1 ? "arrow-top" : '' || this.state.sortState[4] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className="company">Company<a className={this.state.sortState[5] == 1 ? "arrow-top" : '' || this.state.sortState[5] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className="phone"> Phone number<a className={this.state.sortState[6] == 1 ? "arrow-top" : '' || this.state.sortState[6] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className="address" >Address<a className={this.state.sortState[7] == 1 ? "arrow-top" : '' || this.state.sortState[7] == 2 ? "arrow-bottom" : ''} /></th>
                                    <th className='actionHead'>Action</th>
                                </tr>
                            </thead>

                            <tbody className="notEditable">
                                {dataTemp}
                                <tr>
                                    <td className='noBorder' colSpan='8'><input type='submit' id='submitButt' disabled={!isSubmit} value='Submit' ></input></td>

                                    <td className='noBorder'><button className='addButt' onClick={this.addNewLine}>Add</button></td>
                                </tr>

                            </tbody>
                        </table>
                        <div className='result' hidden={!result[0]}>{dataToTable.length - errors.length + '\\' + dataToTable.length + ' ' + result[2]}
                            <br/>
                            
                            <span className="warning"><i className='arrowRight'/> warnings: {warnings.length}</span>
                            <br/>
                            
                            <span className="error"><i className='arrowRight'/> errors: {errors.length} </span>
                        </div>
                    </form>
                </div>
            );
        }
    });

    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
})();

