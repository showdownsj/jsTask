(function (){
var dataFromFile = [];
var genderArr = ['male','female'];

var regExpMail = new RegExp(/@[A-Za-z0-9]+.[a-z]+/g);
var regExpPhone =  new RegExp(/[+\d\s]+[(]+[\d]+[)]+[\s\d-]+/g);


//get new id key for item
function generateID(data){
    var ID = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2,3);
    ID = '5a6b0087' + ID;
    for(var i in data)
        if( data[i].id == ID)
            ID = generateID(data);
    return ID;
}

// set disabled/enabled state for input-item
function createStates(data,states){
    if(states.length == 0){
        states = new Array(data.length);
        
        for(var i in data)
            states[i] = false;
    }
    return states;
}

//There's component to  open and parse file:
//readFile() - parsing adjusted JSON file; 
// render () - representation table with data (or empty table with possibility to add data there) 
//             from files (representation defines in TableList component );

var App = React.createClass({

    getInitialState : function(){
        return {stateNow: 0}
    },
    readFile: function(e){
           e.preventDefault();
           
           var file = e.target.files[0];
           var reader = new FileReader();
           var self = this;
           
           reader.onload = function(e){
               var jsonSTR = e.target.result.trim();
               
               dataFromFile = JSON.parse(jsonSTR);
               //console.log(dataFromFile);
               self.setState({stateNow: ++self.stateNow});
               
           };
           reader.readAsText(file);
    },
    render: function() {
       
      return (
        <div className="app">
          <input type= "file" onChange={this.readFile} ></input>
          <TableList data = {dataFromFile}/>
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
    
    getInitialState : function(){
      
        
        return {
            disabled: [],
            dataTable:null
    
        }
    },
    onChangeHandler: function(e) {
        e.preventDefault();
        var targetRowID = e.target.parentNode.parentNode.getAttribute('data-reactid');
        var entryID = targetRowID.slice(targetRowID.indexOf('$')+1);
        var dataTable = this.props.data;
        var propName = e.target.className;
        var value = e.target.value;
        for(var numElem in dataTable){
            
            if(dataTable[numElem].id == entryID){
                if(propName =='age' && !isNaN(value) )
                    dataTable[numElem][propName] = parseInt(value)||0;
                
                else if(propName !='age')
                    dataTable[numElem][propName] = value;
              
                console.log(dataTable[numElem]);
            }
        
        }

        this.setState({dataTable:dataTable});

        
    },
    addNewLine: function(e){
        e.preventDefault();
        //console.log(this.props.data);
        var dataTable = this.props.data;
        var disabled = createStates(dataTable,this.state.disabled);
        
        dataTable.push({id:generateID(dataTable),
                        name:'',
                        age:'',
                        gender:'',
                        phone:'',
                        company:'',
                        email:'',
                        address:''
                        });
        disabled[dataTable.length-1] = true;
        //console.log(states);
        this.setState({disabled:disabled,
                        dataTable:dataTable
                    });
        //console.log(dataTable);
    },
    onCLickEdit: function(e){
        e.preventDefault();
        var targetRowID = e.target.parentNode.parentNode.getAttribute('data-reactid');
        var entryID = targetRowID.slice(targetRowID.indexOf('$')+1);
        var dataTable = this.props.data;
        var disabled = createStates(dataTable,this.state.disabled);

        for(var numElem in dataTable)
            if(dataTable[numElem].id == entryID)
                    disabled[numElem] =  disabled[numElem] ? false : true;
        this.setState({disabled:disabled});
    },
    onClickDelete: function(e){
        e.preventDefault();
        var targetRowID = e.target.parentNode.parentNode.getAttribute('data-reactid');
        var entryID = targetRowID.slice(targetRowID.indexOf('$')+1);
        var dataTable = this.props.data;
        var disabled = createStates(dataTable,this.state.disabled);
        
        for(var numElem in dataTable)
            if(dataTable[numElem].id == entryID){
              dataTable.splice(numElem,1);
              disabled.splice(numElem,1);
            }
           // console.log(dataTable);
            this.setState({disabled:disabled,
                dataTable:dataTable
            }); 
          


    },
    render : function(){
        //console.log(this.props.data);
        var dataToTable = this.state.dataTable||this.props.data; 
        
        var dataTemp;
        self =this;
        if(dataToTable.length > 0){
            
           dataTemp = dataToTable.map(function(item,index){
        
                return(
                   <tr key={item.id}>
                        <td><input type='text' value={item.name} className = "name" onChange={self.onChangeHandler} disabled ={!self.state.disabled[index]}> </input></td>
                        <td><input type='text' value={item.age} className = "age" onChange={self.onChangeHandler} disabled ={!self.state.disabled[index]}></input></td>
                        <td><select className = 'gender'  onChange={self.onChangeHandler} value = {item.gender} disabled ={!self.state.disabled[index]}>
                               <option value='male' >{"male"}</option>
                                <option value='female' >{"female"}</option>
                        </select></td>
                            
                        <td><input regexp = {regExpMail} type='text' value={item.email} className = "email" onChange={self.onChangeHandler} disabled ={!self.state.disabled[index]}></input></td>
                        <td><input type='text' value={item.company} className = "company" onChange={self.onChangeHandler} disabled ={!self.state.disabled[index]}></input></td>
                        <td><input type='text' value={item.phone} className = "phone" onChange={self.onChangeHandler} disabled ={!self.state.disabled[index]}></input></td>
                        <td><input type='text' value={item.address} className = "address" onChange={self.onChangeHandler} disabled ={!self.state.disabled[index]}></input></td>
                        <td><button className = 'editButt' onClick = {self.onCLickEdit}>{self.state.disabled[index]?"End edit":"Edit"}</button> 
                            <button className = 'deleteButt' onClick = {self.onClickDelete}>Delete</button>
                        </td>
                    </tr>
                )} 
                )
        } ;
        
        return(
            
            <div className = "tableList">
           
            <table className="table table-hover">
                      <thead>
                          <tr>
                              <th>Name</th>
                              <th>Age</th>
                              <th>Gender</th>
                              <th>Email</th>
                              <th>Company</th>
                              <th>Phone number</th>
                              <th>Adress</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                     
                      <tbody className = "notEditable">
                     
                       {dataTemp}
                    
                    
                        <tr>
                            <td><input type='submit' id='submitButt' disabled/></td>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td><button className='addButt' onClick = {this.addNewLine}>Add</button></td>
                        </tr>
                        </tbody> 
                       
              
              </table>
          
            </div>  
        );
    }


    
  });

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
})(); 

