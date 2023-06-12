import React, { Component } from 'react';
import ViewGroups from './../components/view_groups'
import Tags from './../components/tags';
import Letter from './../assets/letter.png'; 
import EthereumTestnet from './../assets/ethereum_testnet.png';


function number_with_commas(x) {
    if(x == null) x = '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



class PostDetailSection extends Component {
    
    state = {
        selected: 0,
        navigate_view_ethers_list_detail_tags_object: this.get_navigate_view_ethers_list_detail_tags(),
    };

    get_navigate_view_ethers_list_detail_tags(){
        return{
          'i':{
              active:'e', 
          },
          'e':[
              ['or','',0], ['e','details','transactions'],[0]
          ],
        }
    }

    render(){
        return(
            <div>
                {this.render_post_detail_object()}
            </div>
        )
    }

    render_post_detail_object(){
        var selected_page = this.props.page;
        if(selected_page == '?'){
            var selected_tag = this.props.work_page_tags_object['i'].active
            if(selected_tag == 'contracts' || selected_tag == 'e'){
                return(
                <div>{this.render_contracts_list_detail()}</div>
                )
            }
            else if(selected_tag == 'proposals' ){
                return(
                <div>{this.render_proposal_list_detail()}</div>
                )
            }
            else if(selected_tag == 'subscriptions' ){
                return(
                <div>{this.render_subscription_list_detail()}</div>
                )
            }
        }
        else if(selected_page == 'e'){
            var selected_tag = this.state.explore_page_tags_object['i'].active
            if(selected_tag == 'E5s' || selected_tag == 'e'){
                return(
                <div>{this.render_E5s_list_detail()}</div>
                )
            }
            else if(selected_tag == 'posts' ){
                return(
                <div>{this.render_posts_list_detail()}</div>
                )
            }
            else if(selected_tag == 'channels' ){
                return(
                <div>{this.render_channels_list_detail()}</div>
                )
            }
        }
        else if(selected_page == 'w'){
            var selected_tag = this.props.wallet_page_tags_object['i'].active
            var selected_item = this.props.wallet_page_tags_object['e'][2][0];
            var selected_option_name = this.props.wallet_page_tags_object['e'][1][selected_item];
            if(selected_option_name == 'ethers ⚗️' || selected_option_name == 'e'){
                return(
                <div>{this.render_ethers_list_detail()}</div>
                )
            }
            else if(selected_option_name == 'ends ☝️' ){
                return(
                <div>{this.render_ends_list_detail()}</div>
                )
            }
            else if(selected_option_name == 'spends 🫰' ){
                return(
                <div>{this.render_spends_list_detail()}</div>
                )
            }
        }
    }



    render_contracts_list_detail(){

    }


    render_proposal_list_detail(){

    }


    render_subscription_list_detail(){

    }



    //#region E5 list data
    render_E5s_list_detail(){

    }

    render_posts_list_detail(){

    }

    render_channels_list_detail(){

    }
    //#endregion



    render_ethers_list_detail(){
        
        if(this.props.selected_ether_item == null){
            return(
                <div>
                    {this.render_empty_detail_object()}
                </div>
            )
        }else{
            return(
                <div>
                    {this.render_ether_details_section()}
                    <div style={{ width:'100%','padding':'0px 0px 0px 0px','margin':'0px 0px 20px 0px', 'max-width':'470px'}}>
                        <Tags page_tags_object={this.state.navigate_view_ethers_list_detail_tags_object} tag_size={'l'} when_tags_updated={this.when_navigate_view_ethers_list_detail_tags_object_updated.bind(this)}/>
                    </div>
                </div>
            )
        }
        
    }

    render_ether_details_section(){
        var selected_item = this.get_selected_item(this.state.navigate_view_ethers_list_detail_tags_object, this.state.navigate_view_ethers_list_detail_tags_object['i'].active)

        if(selected_item == 'details' || selected_item == 'e'){
            return(
                <div>
                    {this.render_ethers_main_details_section()}
                </div>
            )
        }else if(selected_item == 'transactions'){
            return(
                <div>
                    {this.render_block_history_logs()}
                </div>
            )
            
        }
        
    }

    get_selected_item(object, option){
        var selected_item = object[option][2][0]
        var picked_item = object[option][1][selected_item];
        return picked_item
    }

    render_ethers_main_details_section(){
        var he = this.props.height-90
        var size = this.props.screensize
        if(size == 'm'){
            he = this.props.height-190;
        }
        var item = this.get_ethers_data()[this.props.selected_ether_item];
        return(
            <div style={{ width:'99%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','margin':'5px 10px 20px 10px', 'padding':'0px 10px 0px 10px', 'max-width':'470px'}}>
                <div style={{ 'overflow-y': 'auto', width:'100%', height: he, padding:'0px 10px 0px 10px'}}>
                    
                    {this.render_detail_item('7', item['banner-icon'])}
                    {this.render_detail_item('1', item['tags'])}
                    <div style={{height: 20}}/>
                    {this.render_detail_item('2', item['number_label_large'])}
                    {this.render_detail_item('0')}

                    {this.render_detail_item('3', item['chain_id'])}
                    <div style={{height: 10}}/>
                    {this.render_detail_item('3', item['peer_count'])}
                    <div style={{height: 10}}/>
                    {this.render_detail_item('3', item['network_type'])}
                    {this.render_detail_item('0')}

                    {this.render_detail_item('3', item['gas_used_chart_data_label'])}
                    {this.render_detail_item('6', item['gas_used_chart_data'])}
                    <div style={{height: 10}}/>
                    {this.render_detail_item('3', item['gas_used_chart_data_average'])}
                    <div style={{height: 10}}/>
                    {this.render_detail_item('3', item['highest_gas_consumed'])}
                    <div style={{height: 10}}/>
                    {this.render_detail_item('3', item['lowest_gas_consumed'])}
                    {this.render_detail_item('0')}

                    {this.render_detail_item('3', item['transaction_count_chart_data_label'])}
                    {this.render_detail_item('6', item['transaction_count_chart_data'])}
                    {this.render_detail_item('0')}

                    {this.render_detail_item('3', item['gas_limit'])}
                    <div style={{height: 10}}/>
                    {this.render_detail_item('3', item['base_fee_per_gas'])}
                    {this.render_detail_item('0')}

                    {this.render_detail_item('5', {'text':'Send Receive Ether', 'action': 'send_receive_ether'})}

                    {this.render_detail_item('0')}
                    {this.render_detail_item('0')}
                </div>
            </div>
        )
    }

    when_navigate_view_ethers_list_detail_tags_object_updated(tag_group){
        this.setState({navigate_view_ethers_list_detail_tags_object: tag_group})
    }

    render_block_history_logs(){
        var middle = this.props.height-100;
        var size = this.props.screensize;
        if(size == 'm'){
            middle = this.props.height-190;
        }
        var items = this.props.app_state.E15last_blocks
        return ( 
            <div style={{overflow: 'auto',height: middle, 'margin':'0px 0px 20px 0px'}}>
                <ul style={{ 'padding': '10px 0px 0px 20px', 'list-style': 'none'}}>
                    {items.reverse().map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_block_history_log_item(item, index)}
                        </li>
                    ))}
                    <div style={{'padding': '5px'}}>
                        {this.render_empty_object()}
                    </div>
                    <div style={{'padding': '5px'}}>
                        {this.render_empty_object()}
                    </div>
                </ul>
            </div>
        );
    }

    render_block_history_log_item(item, index){
        var item_object = this.get_block_history_log_item_object(item)
        return ( 
            <div onClick={() => console.log()} style={{height:'auto', 'background-color': 'rgb(225, 225, 225,.8)', 'border-radius': '15px','padding':'5px 5px 0px 0px', 'max-width':'420px', 'box-shadow': '0px 0px 1px 2px #DCDCDC'}}>
                <div style={{'padding': '5px 0px 5px 5px'}}>
                    {this.render_detail_item('1', item_object['tags'])}
                    <div style={{'padding': '0px 10px 0px 10px'}}>
                        {this.render_detail_item('3', item_object['number'])}
                    </div>
                    <div style={{height: 5}}/>
                    <div style={{'padding': '0px 10px 0px 10px'}}>
                        {this.render_detail_item('3', item_object['gasUsed'])}
                    </div>
                    <div style={{height: 5}}/>
                    <div style={{'padding': '0px 10px 0px 10px'}}>
                        {this.render_detail_item('3', item_object['miner'])}
                    </div>
                    <div style={{height: 5}}/>
                </div>         
            </div>
        );
    }


    get_block_history_log_item_object(item){
        return{
            'tags':{'active_tags':[this.get_time_difference(item.timestamp)+' ago'], 'indexed_option':'indexed'},
            'number':{'title':item.number,'details':' Block Number', 'size':'s'},
            'gasUsed':{'title':number_with_commas(item.gasUsed),'details':' Gas Used', 'size':'s'},
            'miner':{'details':item.miner,'title':' Transaction Miner', 'size':'s'}
        }
    }

    /* gets a formatted time diffrence from now to a given time */
    get_time_difference(time){
        var number_date = Math.round(parseInt(time));
        var now = Math.round(new Date().getTime()/1000);

        var diff = now - number_date;
        if(diff < 60){//less than 1 min
            return 'now';
        }
        else if(diff < 60*60){//less than 1 hour
            var num = Math.floor(diff/(60));
            var s = num > 1 ? 's': '';
            return num + ' min' 
        }
        else if(diff < 60*60*24){//less than 24 hours
            var num = Math.floor(diff/(60*60));
            var s = num > 1 ? 's': '';
            return num + ' hr' + s;
        }
        else if(diff < 60*60*24*7){//less than 7 days
            var num = Math.floor(diff/(60*60*24));
            var s = num > 1 ? 's': '';
            return num + ' dy' + s;
        }
        else if(diff < 60*60*24*7*53){//less than 1 year
            var num = Math.floor(diff/(60*60*24*7));
            var s = num > 1 ? 's': '';
            return num + ' wk' + s;
        }
        else {//more than a year
            var num = Math.floor(diff/(60*60*24*7*53));
            var s = num > 1 ? 's': '';
            return num + ' yr' + s;
        }
    }

    render_ends_list_detail(){

    }


    render_spends_list_detail(){

    }


    render_empty_detail_object(){
        var he = this.props.height
        var size = this.props.screensize
        if(size == 'm'){
            he = this.props.height-190;
        }
        return(
            <div style={{height:he, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center','margin':'0px 0px 20px 0px'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
        );
    }





    /* renders the specific element in the post or detail object */
    render_detail_item(item_id, object_data){
        return(
            <div>
                <ViewGroups item_id={item_id} object_data={object_data} open_send_receive_ether_bottomsheet={this.props.open_send_receive_ether_bottomsheet.bind(this)}/>
            </div>
        )

    }


    get_ethers_data(){
        return [
            {
                'name': 'Ethereum Testnet',
                'symbol': 'ETHT',
                'image': EthereumTestnet,
                'label':{'title':'ETHT', 'details':'Ethereum Testnet', 'size':'l', 'image': EthereumTestnet},
                'tags':{'active_tags':['Ethereum', 'Ether', 'EVM', 'Chain'], 'index_option':'indexed'},
                'number_label':this.get_blockchain_data('s'),
                'number_label_large': this.get_blockchain_data('l'),
                'banner-icon':{'header':'ETHT', 'subtitle':'Ethereum Testnet', 'image':EthereumTestnet},
                'chain_id':{'title':this.props.app_state.chain_id, 'details':'Chain ID', 'size' :'l'},
                'peer_count':{'title':this.props.app_state.number_of_peers, 'details':'Number of Peers', 'size' :'l'},
                'network_type':{'title':this.props.app_state.network_type, 'details':'Network Type', 'size' :'l'},
                
                'gas_used_chart_data_label':{'title':'Gas Used', 'details':'Amount of gas used in the last 100 blocks', 'size' :'l'},
                'gas_used_chart_data':{'chart_color':'#FCFCFC', 'background_color':'#D5D5D5', 'dataPoints':this.get_gas_used_data_points()},
                'gas_used_chart_data_average':{'title':number_with_commas(this.get_gas_used_data_point_average()), 'details':'Average Gas Used', 'size' :'l'},
                'highest_gas_consumed':{'title':number_with_commas(this.get_highest_gas_figure()), 'details':'Highest amount of Gas Consumed for Last 100 Blocks', 'size' :'l'},
                'lowest_gas_consumed':{'title':number_with_commas(this.get_lowest_gas_figure()), 'details':'Lowest amount of Gas Consumed for Last 100 Blocks', 'size' :'l'},

                'transaction_count_chart_data_label':{'title':'Transactions Processed', 'details':'Amount of transactions processed in the last 100 blocks', 'size' :'l'},
                'transaction_count_chart_data':{'chart_color':'#FCFCFC', 'background_color':'#D5D5D5', 'dataPoints':this.get_transaction_count_data_points()},
                

                'gas_limit':{'title':number_with_commas(this.get_latest_block_data().gasLimit), 'details':'Gas Limit per Block', 'size' :'l'},
                'base_fee_per_gas':{'title':number_with_commas(this.get_latest_block_data().baseFeePerGas), 'details':'Base Fee per Gas Unit', 'size' :'l'},
            }
        ]
    }

    get_blockchain_data(size){
        return{
            'style':size,
            'title':'Number of Blocks Mined',
            'subtitle':'e?',
            'barwidth':this.get_number_width(this.props.app_state.E15number_of_blocks),
            'number':`${number_with_commas(this.props.app_state.E15number_of_blocks)} blocks`,
            'barcolor':'#606060',
            'relativepower':'ledger size',
        }
    }

    get_number_width(number){
        var last_two_digits = number.toString().slice(0, 1)+'0';
        if(number > 10){
            last_two_digits = number.toString().slice(0, 2);
        }
        return last_two_digits+'%'
    }

    get_latest_block_data(){
        if(this.props.app_state.E15last_blocks.length  ==  0){
            return []
        }
        return this.props.app_state.E15last_blocks[0];
    }


    get_gas_used_data_points(){
        var xVal = 1, yVal = 0;
        var dps = [];
        var noOfDps = this.props.app_state.E15last_blocks.length;
        var highest_gas_figure = this.get_highest_gas_figure();
        for(var i = noOfDps-1; i >= 0; i--) {
            if(this.props.app_state.E15last_blocks[i] != null){
                var gas_used = this.props.app_state.E15last_blocks[i].gasUsed;
                // var final_val = Math.floor((gas_used/highest_gas_figure)*100)
                var final_val = gas_used;
                if(final_val > (highest_gas_figure*0.8)){
                    yVal = final_val;
                }else{
                    yVal = (highest_gas_figure*0.9999999999999)
                }

                if(i%50 == 0 && i != 0){
                    dps.push({x: xVal,y: yVal, indexLabel: ""+number_with_commas(gas_used)});//
                }else{
                    dps.push({x: xVal,y: yVal});//
                }
                
            }
            
            xVal++;
        }

        return dps;
    }

    get_transaction_count_data_points(){
        var xVal = 1, yVal = 0;
        var dps = [];
        var noOfDps = this.props.app_state.E15last_blocks.length;
        for(var i = noOfDps-1; i >= 0; i--) {
            if(this.props.app_state.E15last_blocks[i] != null){
                var transaction_count = this.props.app_state.E15last_blocks[i].transactions.length;
                yVal = transaction_count;

                if(i%50 == 0 && i != 0){
                    dps.push({x: xVal,y: yVal, indexLabel: ""+transaction_count});//
                }else{
                    dps.push({x: xVal,y: yVal});//
                }
                
            }
            
            xVal++;
        }

        return dps;
    }

    get_highest_gas_figure(){
        var highest = 0
        var noOfDps = this.props.app_state.E15last_blocks.length;
        for(var i = 0; i < noOfDps; i++) {
            if(this.props.app_state.E15last_blocks[i] != null){
                if(highest < this.props.app_state.E15last_blocks[i].gasUsed){
                    highest = this.props.app_state.E15last_blocks[i].gasUsed;
                }
            }
            
        }
        return highest
    }

    get_lowest_gas_figure(){
        var lowest = 3000000000
        var noOfDps = this.props.app_state.E15last_blocks.length;
        for(var i = 0; i < noOfDps; i++) {
            if(this.props.app_state.E15last_blocks[i] != null){
                if(this.props.app_state.E15last_blocks[i].gasUsed < lowest && this.props.app_state.E15last_blocks[i].gasUsed != 0){
                    lowest = this.props.app_state.E15last_blocks[i].gasUsed;
                }
            }
            
        }
        return lowest
    }

    get_gas_used_data_point_average(){
        var noOfDps = this.props.app_state.E15last_blocks.length-1;
        var total = 0
        for(var i = 0; i < noOfDps; i++) {
            if(this.props.app_state.E15last_blocks[i] != null){
                total += this.props.app_state.E15last_blocks[i].gasUsed
            }
            
        }

        if(total == 0) return 0;
        return Math.floor(total / noOfDps)
    }

    render_empty_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }


}



export default PostDetailSection;