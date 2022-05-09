const Filter = (props) =>{
    
    return(
    <div>
        filter shown with <input
                            value={props.newSearch}
                            onChange={props.handleSearch}
                          />
    </div>)
} 

export default Filter
