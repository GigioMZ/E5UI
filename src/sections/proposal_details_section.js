import React, { Component } from 'react';
import ViewGroups from './../components/view_groups'
import Tags from './../components/tags';
import Letter from './../assets/letter.png';
import TextInput from './../components/text_input';
import E5EmptyIcon3 from './../assets/e5empty_icon3.png';

var bigInt = require("big-integer");


function bgN(number, power) {
  return bigInt((number+"e"+power)).toString();
}

function number_with_commas(x) {
    if(x == null) x = '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class ProposalDetailsSection extends Component {
    
    state = {
        selected: 0,navigate_view_proposal_list_detail_tags_object: this.get_navigate_view_proposal_list_detail_tags(),
    };

    get_navigate_view_proposal_list_detail_tags(){
        return{
          'i':{
              active:'e', 
          },
          'e':[
              ['xor','',0], ['e','details', 'proposal-actions','activity'],[1]
          ],
        }
    }

    render(){
        return(
            <div>{this.render_proposals_list_detail()}</div>
        )
    }

    render_proposals_list_detail(){
        if(this.props.selected_proposal_item == null){
            return(
                <div>
                    {this.render_empty_detail_object()}
                </div>
            )
        }else{
            return(
                <div>
                    {this.render_proposal_details_section()}
                    <div style={{ width:'100%','padding':'0px 0px 0px 0px','margin':'0px 0px 20px 0px', 'max-width':'470px'}}>
                        <Tags page_tags_object={this.state.navigate_view_proposal_list_detail_tags_object} tag_size={'l'} when_tags_updated={this.when_navigate_view_proposal_list_detail_tags_object_updated.bind(this)} theme={this.props.theme}/>
                    </div>
                </div>
            )
        }
    }

    when_navigate_view_proposal_list_detail_tags_object_updated(tag_obj){
        this.setState({navigate_view_proposal_list_detail_tags_object: tag_obj})
    }

    get_selected_item(object, option){
        var selected_item = object[option][2][0]
        var picked_item = object[option][1][selected_item];
        return picked_item
    }


    render_proposal_details_section(){
        var selected_item = this.get_selected_item(this.state.navigate_view_proposal_list_detail_tags_object, this.state.navigate_view_proposal_list_detail_tags_object['i'].active)

        if(selected_item == 'details'){
            return(
                <div>
                    {this.render_proposal_main_details_section()}
                </div>
            )
        }
        else if(selected_item == 'proposal-actions'){
            return(
                <div>
                    {this.render_proposal_actions()}
                </div>
            )
        }
        else if(selected_item == 'activity'){
            return(
                <div>
                    {this.render_proposal_message_activity()}
                </div>
            )
        }
    }

    render_empty_detail_object(){
        var background_color = this.props.theme['card_background_color']
        var he = this.props.height
        var size = this.props.screensize
        if(size == 'm'){
            he = this.props.height-190;
        }
        return(
            <div style={{height:he, width:'100%', 'background-color': background_color, 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center','margin':'0px 0px 20px 0px'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
        );
    }

    render_proposal_main_details_section(){
        var background_color = this.props.theme['card_background_color']
        var he = this.props.height-70
        var size = this.props.screensize
        if(size == 'm'){
            he = this.props.height-190;
        }
        var item = this.get_proposal_details_data()
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        return(
            <div style={{ width:'95%', 'background-color': background_color, 'border-radius': '15px','margin':'5px 10px 20px 10px', 'padding':'0px 10px 0px 10px', 'max-width':'470px'}}>
                <div style={{ 'overflow-y': 'auto', width:'100%', height: he, padding:'0px 0px 0px 0px'}}>
                    {this.render_detail_item('1', item['tags'])}
                    <div style={{height: 10}}/>
                    <div style={{'padding': '0px 0px 0px 0px'}}>
                        {this.render_detail_item('3', item['id'])}
                    </div>
                    <div style={{height: 10}}/>
                    <div style={{'background-color': this.props.theme['view_group_card_item_background'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                        {this.render_detail_item('2', item['age'])}
                    </div>

                    {this.render_detail_item('0')}
                    {this.render_detail_item('3', item['consensus_type'])}
                    
                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['proposal_expiry_time'])}
                    
                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['proposal_expiry_time_from_now'])}

                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['consensus_submit_expiry_time'])}

                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['proposal_submit_expiry_time_from_now'])}
                    
                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['target_contract_authority'])}

                    {this.render_modify_target_if_any(item)}

                    {this.render_detail_item('0')}

                    <div style={{'background-color': this.props.theme['view_group_card_item_background'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                        {this.render_detail_item('2', item['end_balance'])}
                    </div>

                    <div style={{height:10}}/>
                    <div style={{'background-color': this.props.theme['view_group_card_item_background'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                        {this.render_detail_item('2', item['spend_balance'])}
                    </div>

                    {this.render_detail_item('0')}

                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['vote_wait'])}

                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['vote_yes'])}

                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['vote_no'])}


                    {this.render_detail_item('0')}
                    {this.render_detail_item('3', {'title':'Vote in Proposal', 'details':'Cast a vote in this proposal and collect some bounty', 'size':'l'})}
                    <div style={{height:10}}/>
                    <div onClick={()=>this.open_vote_proposal_ui()}>
                        {this.render_detail_item('5', {'text':'Vote Proposal', 'action':''})}
                    </div>

                    {this.render_detail_item('0')}
                    {this.render_detail_item('3', {'title':'Submit Proposal', 'details':'Submit the proposal to perform its actions', 'size':'l'})}
                    <div style={{height:10}}/>
                    <div onClick={()=>this.open_sumbit_proposal_ui()}>
                        {this.render_detail_item('5', {'text':'Submit Proposal', 'action':''})}
                    </div>

                    {this.render_archive_button_if_author()}

                    {this.render_detail_item('0')}
                    {this.render_detail_item('0')}
                </div>
            </div>
        )
    }

    open_vote_proposal_ui(){
        this.props.open_vote_proposal_ui(this.get_proposal_items()[this.props.selected_proposal_item])
    }

    open_sumbit_proposal_ui(){
        this.props.open_sumbit_proposal_ui(this.get_proposal_items()[this.props.selected_proposal_item])
    }

    open_archive_proposal_ui(){
        this.props.open_archive_proposal_ui(this.get_proposal_items()[this.props.selected_proposal_item])
    }

    render_archive_button_if_author(){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var my_account = this.props.app_state.user_account_id
        if(object['event'].returnValues.p3 == my_account && object['data'][1][3] < Date.now()/1000){
            return(
                <div>
                    {this.render_detail_item('0')}
                    {this.render_detail_item('3', {'title':'Archive Proposal', 'details':'Delete the proposals data to free up space in the blockchain', 'size':'l'})}
                    <div style={{height:10}}/>
                    <div onClick={()=>this.open_archive_proposal_ui()}>
                        {this.render_detail_item('5', {'text':'Archive Proposal', 'action':''})}
                    </div>
                </div>
            )
        }
    }

    render_modify_target_if_any(item){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var proposal_config = object['data'][1]

        if(proposal_config[0] == 1){
            return(
                <div>
                    <div style={{height:10}}/>
                    {this.render_detail_item('3', item['modify_target'])}
                </div>
            )
        }
    }

    get_proposal_items(){
        var selected_option_name = this.get_selected_item(this.props.work_page_tags_object, this.props.work_page_tags_object['i'].active)

        if(this.props.work_page_tags_object['i'].active != 'proposals'){
            return this.props.app_state.my_proposals 
        }

        if(selected_option_name == 'my-proposals'){
            return this.props.app_state.my_proposals
        }
        else if(selected_option_name == 'viewed'){
            var my_viewed_proposals = []
            for(var i=0; i<this.props.viewed_proposals.length; i++){
                my_viewed_proposals.push(this.props.app_state.my_proposals[this.props.viewed_proposals[i]])
            }
            return my_viewed_proposals
        }
        else {
            var proposals = []
            var myid = this.props.app_state.user_account_id
            for(var i = 0; i < this.props.app_state.my_proposals.length; i++){
                var proposal_author = this.props.app_state.my_proposals[i]['event'].returnValues.p3
                if(proposal_author.toString() == myid.toString()){
                    proposals.push(this.props.app_state.my_proposals[i])
                }else{
                    console.log('sender not proposal author: author->'+proposal_author+', sender id->'+myid)
                }
            }
            return proposals
        }
    }

    get_proposal_details_data(){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var tags = object['ipfs'] == null ? ['Proposal'] : object['ipfs'].entered_indexing_tags
        var title = object['ipfs'] == null ? 'Proposal ID' : object['ipfs'].entered_title_text
        var age = object['event'] == null ? 0 : object['event'].returnValues.p6
        var time = object['event'] == null ? 0 : object['event'].returnValues.p5

        var consensus_obj = {0:'spend',1:'reconfig', 6:'exchange-transfer'}
        var proposal_config = object['data'][1]
        var consensus_type = consensus_obj[proposal_config[0]]

        

        return {
            'tags':{'active_tags':tags, 'index_option':'indexed'},
            'id':{'title':object['id'], 'details':title, 'size':'l'},
            'age':{'style':'l', 'title':'Age of Proposal', 'subtitle':'??', 'barwidth':this.get_number_width(age), 'number':`block ${number_with_commas(age)}`, 'barcolor':'', 'relativepower':`${this.get_time_difference(time)}`, },

            '':{'title':'', 'details':'', 'size':'l'},

            'consensus_type':{'title':consensus_type, 'details':'Consensus Type', 'size':'l'},
            'proposal_expiry_time':{'title':'Proposal Expiry time', 'details':''+(new Date(proposal_config[1]*1000)), 'size':'l'},
            'proposal_expiry_time_from_now':{'title':this.get_time_from_now(proposal_config[1]), 'details':'Proposal expiry time from now', 'size':'l'},

            'consensus_submit_expiry_time':{'title':'Proposal Submit Expiry time', 'details':''+(new Date(proposal_config[3]*1000)), 'size':'l'},
            'proposal_submit_expiry_time_from_now':{'title':this.get_time_from_now(proposal_config[3]), 'details':'Proposal submit expiry time from now', 'size':'l'},

            'target_contract_authority':{'title':proposal_config[5], 'details':'Contract Authority ID', 'size':'l'},
            'modify_target':{'title':proposal_config[9], 'details':'Modify Target', 'size':'l'},


            'end_balance':{'style':'l', 'title':'End Bounty Balance', 'subtitle':'End', 'barwidth':this.get_number_width(object['end_balance']), 'number':`${number_with_commas(object['end_balance'])}`, 'barcolor':'', 'relativepower':`tokens`, },

            'spend_balance':{'style':'l', 'title':'Spend Bounty Balance', 'subtitle':'Spend', 'barwidth':this.get_number_width(object['spend_balance']), 'number':` ${number_with_commas(object['spend_balance'])}`, 'barcolor':'', 'relativepower':`tokens`, },


            'vote_wait':{'title':''+object['consensus_data'][0]+' WAIT votes', 'details':this.get_proportion_of_total(object, object['consensus_data'][0])+'%', 'size':'l'},

            'vote_yes':{'title':''+object['consensus_data'][1]+' YES votes', 'details':this.get_proportion_of_total(object, object['consensus_data'][1])+'%', 'size':'l'},

            'vote_no':{'title':''+object['consensus_data'][2]+' NO votes', 'details':this.get_proportion_of_total(object, object['consensus_data'][2])+'%', 'size':'l'},
        }
    }

    get_proportion_of_total(object, vote_count){
        var sum = bigInt(object['consensus_data'][0]) + bigInt(object['consensus_data'][1]) + bigInt(object['consensus_data'][2]);

        if(sum == bigInt(0)){
            return 0
        }

        var prop = (bigInt(vote_count).divide(sum)).multiply(100)

        if(isNaN(prop)){
            return 0
        }
        return prop
    }



    render_proposal_actions(){
        var background_color = this.props.theme['card_background_color']
        var he = this.props.height-70
        var size = this.props.screensize
        if(size == 'm'){
            he = this.props.height-190;
        }
        var items = this.get_proposal_action_data()
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var proposal_action = object['data'][1][0]

        if(proposal_action == 0){
           return(
                <div style={{ width:'95%','margin':'5px 10px 20px 10px', 'padding':'0px 0px 0px 0px', 'max-width':'470px'}}>
                    <div style={{ 'overflow-y': 'auto', width:'100%', height: he, padding:'0px 0px 0px 0px'}}>
                        {this.render_spend_actions(items)}
                    </div>
                </div> 
            )
        }
        else if(proposal_action == 1){
            return(
                <div style={{ width:'95%','margin':'5px 10px 20px 10px', 'padding':'0px 10px 0px 10px', 'max-width':'470px'}}>
                    <div style={{ 'overflow-y': 'auto', width:'100%', height: he, padding:'0px 0px 0px 0px'}}>
                        {this.load_reconfig_items(items)}
                    </div>
                </div> 
            )
        }
        else if(proposal_action == 6){
            return(
                <div style={{ width:'95%','margin':'5px 10px 20px 10px', 'padding':'0px 10px 0px 10px', 'max-width':'470px'}}>
                    <div style={{ 'overflow-y': 'auto', width:'100%', height: he, padding:'0px 0px 0px 0px'}}>
                        {this.load_transfer_actions(items)}
                    </div>
                </div> 
            )
        }

        
    }

    get_proposal_action_data(){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var proposal_action = object['data'][1][0]

        if(proposal_action == 0){
            var return_items = object['ipfs'].spend_actions
            return return_items
        }
        else if(proposal_action == 1){
            var return_items = object['ipfs'].reconfig_values 
            return return_items
        }
        else if(proposal_action == 6){
            var return_items = object['ipfs'].exchange_transfer_values
            return return_items
        }
    }



    render_spend_actions(items){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var middle = this.props.height-100;
        var size = this.props.size;
        if(size == 'm'){
            middle = this.props.height-100;
        }

        if(items.length == 0){
            items = [0, 1]
            return(
                <div style={{overflow: 'auto', maxHeight: middle}}>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.map((item, index) => (
                            <li style={{'padding': '5px'}} onClick={()=>console.log()}>
                                <div style={{height:60, width:'100%', 'background-color': this.props.theme['card_background_color'], 'border-radius': '15px','padding':'10px 0px 10px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                                    <div style={{'margin':'10px 20px 10px 0px'}}>
                                        <img src={Letter} style={{height:30 ,width:'auto'}} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }else{
            return(
                <div style={{overflow: 'auto', maxHeight: middle}}>
                    {this.render_detail_item('3', {'title':'In '+object['id'], 'details':'Spend Actions', 'size':'l'})}
                    <div style={{height:'1px', 'background-color':'#C1C1C1', 'margin': '10px 20px 10px 20px'}}/>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.reverse().map((item, index) => (
                            <li style={{'padding': '5px'}} onClick={()=>this.when_when_spend_action_clicked(item)}>
                                {this.render_detail_item('3', {'title':''+this.format_account_balance_figure(item['amount'])+' '+this.props.app_state.token_directory[item['spend_token']], 'details':'target: '+item['spend_target']+', token ID: '+item['spend_token'], 'size':'l'})}
                            </li>
                        ))}
                        {this.render_empty_elements()}
                        {this.render_empty_elements()}
                    </ul>
                </div>
            )
        }
    }

    render_empty_elements(){
        return(
            <div style={{height:60, width:'100%', 'background-color': this.props.theme['card_background_color'], 'border-radius': '7px', 'margin':'0px 5px 5px 5px','padding':'10px 0px 10px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                <div style={{'margin':'10px 20px 10px 0px'}}>
                    <img src={Letter} style={{height:30 ,width:'auto'}} />
                </div>
            </div>
        )
    }



    load_reconfig_items(items){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var middle = this.props.height-100;
        var size = this.props.size;
        if(size == 'm'){
            middle = this.props.height-100;
        }

        if(items.length == 0){
            items = [0,3,0]
            return(
                <div style={{overflow: 'auto', maxHeight: middle}}>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.map((item, index) => (
                            <li style={{'padding': '5px'}} onClick={()=>console.log()}>
                                <div style={{height:140, width:'100%', 'background-color': this.props.theme['card_background_color'], 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                                    <div style={{'margin':'10px 20px 0px 0px'}}>
                                        <img src={Letter} style={{height:40 ,width:'auto'}} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }else{
            return(
                <div style={{overflow: 'auto', maxHeight: middle}}>
                    {this.render_detail_item('3', {'title':'In '+object['id'], 'details':'Reconfig Actions', 'size':'l'})}
                    <div style={{height:'1px', 'background-color':'#C1C1C1', 'margin': '10px 20px 10px 20px'}}/>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.map((item, index) => (
                            <li style={{'padding': '5px'}} onClick={()=>this.when_added_modify_item_clicked(item)}>
                                {this.render_detail_item('3', {'title':''+item['title'], 'details':'Modify Target', 'size':'l'})}
                                <div style={{height:5}}/>
                                {this.render_detail_item('3', {'title':''+item['pos'], 'details':'position', 'size':'l'})}
                                <div style={{height:5}}/>
                                {this.render_reconfig_value(item)}
                                <div style={{height:'1px', 'background-color':'#C1C1C1', 'margin': '5px 20px 5px 20px'}}/>
                            </li>
                        ))}
                        {this.render_empty_elements()}
                        {this.render_empty_elements()}
                    </ul>
                </div>
            )
        }
    }

    render_reconfig_value(item){
        var title = item['title'];
        var ui = item['type']
        var number = item['value']
        if(ui == 'number'){
            return(
                <div>
                    <div style={{'background-color': this.props.theme['card_background_color'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                        {this.render_detail_item('2', { 'style':'l', 'title':title, 'subtitle':this.format_power_figure(number), 'barwidth':this.calculate_bar_width(number), 'number':this.format_account_balance_figure(number), 'barcolor':'', 'relativepower':'units', })}
                    </div>
                </div>
            )
        }
        else if(ui == 'proportion'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.format_proportion(number), 'details':'proportion', 'size':'l'})}
                </div>
            )
        }
        else if(ui == 'time'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.get_time_diff(number), 'details':'duration', 'size':'l'})}

                </div>
            )
        }
        else if(ui == 'tag'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.get_tag_selected_item(title, number), 'details':'value: '+number, 'size':'l'})}
                </div>
            )
        }
        else if(ui == 'id'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':number, 'details':'target ID', 'size':'l'})}
                </div>
            )
        }
    }

    get_tag_selected_item(title, number){
        var obj = {'Auto Wait':{0:'no', 1:'yes'}, 'Moderator Modify Privelage':{1:'modifiable', 0:'non-modifiable'}, 'Unlimited Extend Contract Time':{1:'enabled', 0:'disabled'}, 'Bounty Limit Type':{0:'relative', 1:'absolute'}, 'Force Exit Enabled':{1:'enabled', 0:'disabled'}, 'Halving type':{0:'fixed', 1:'spread'}, 'Block Limit Sensitivity':{1:'1', 2:'2', 3:'3', 4:'4', 5:'5'}}

        return obj[title][number]
    }



    load_transfer_actions(items){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var middle = this.props.height-100;
        var size = this.props.size;
        if(size == 'm'){
            middle = this.props.height-100;
        }

        if(items.length == 0){
            items = [0,3,0]
            return(
                <div style={{overflow: 'auto', maxHeight: middle}}>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.map((item, index) => (
                            <li style={{'padding': '5px'}} onClick={()=>console.log()}>
                                <div style={{height:140, width:'100%', 'background-color': this.props.theme['card_background_color'], 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                                    <div style={{'margin':'10px 20px 0px 0px'}}>
                                        <img src={Letter} style={{height:40 ,width:'auto'}} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }else{
            return(
                <div style={{overflow: 'auto', maxHeight: middle}}>
                    {this.render_detail_item('3', {'title':'In '+object['id'], 'details':'Transfer Actions', 'size':'l'})}
                    <div style={{height:'1px', 'background-color':'#C1C1C1', 'margin': '10px 20px 10px 20px'}}/>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.reverse().map((item, index) => (
                            <li style={{'padding': '5px'}} onClick={()=>this.when_transfer_action_value_clicked(item)}>
                                <div style={{'background-color': this.props.theme['card_background_color'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                                    {this.render_detail_item('2', { 'style':'l', 'title':'Token: '+item['token'], 'subtitle':this.format_power_figure(item['amount']), 'barwidth':this.calculate_bar_width(item['amount']), 'number':this.format_account_balance_figure(item['amount']), 'barcolor':'', 'relativepower':'tokens', })}
                                </div>
                                <div style={{height:5}}/>
                                {this.render_detail_item('3', {'title':'Receiver ID: '+item['receiver'], 'details':'Exchange ID:'+item['exchange'], 'size':'s'})}
                                <div style={{height:'1px', 'background-color':'#C1C1C1', 'margin': '5px 20px 5px 20px'}}/>
                            </li>
                        ))}
                        {this.render_empty_elements()}
                        {this.render_empty_elements()}
                    </ul>
                </div>
            )
        }
    }












    render_proposal_message_activity(){
        var he = this.props.height-90
        var size = this.props.screensize
        
        return(
            <div>
                <div style={{ 'background-color': 'transparent', 'border-radius': '15px','margin':'0px 0px 0px 0px', 'padding':'0px 0px 0px 0px', 'max-width':'470px'}}>
                    <div style={{ 'overflow-y': 'auto', height: he, padding:'5px 0px 5px 0px'}}>
                        {this.render_top_title()}
                        <div style={{height:'1px', 'background-color':'#C1C1C1', 'margin': '10px 20px 10px 20px'}}/>
                        {this.render_sent_received_messages()}
                    </div>
                </div>

                <div style={{'display': 'flex','flex-direction': 'row','margin':'0px 0px 5px 5px', width: '99%'}}>
                    {this.render_image_picker()}
                    <div style={{'margin': '0px 0px 0px 0px', width:this.props.width}}>
                        <TextInput height={30} placeholder={'Enter Message...'} when_text_input_field_changed={this.when_entered_text_input_field_changed.bind(this)} text={this.state.entered_text} theme={this.props.theme}/>
                    </div>

                    <div style={{'padding': '2px 5px 0px 5px', 'width':100}} onClick={()=>this.add_message_to_stack()}>
                        {this.render_detail_item('5', {'text':'Send', 'action':'-'})}
                    </div>
                </div>
            </div> 
        )
    }

    render_top_title(){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        return(
            <div style={{padding:'5px 5px 5px 5px'}}>
                {this.render_detail_item('3', {'title':'In '+object['id'], 'details':object['ipfs'].entered_title_text, 'size':'l'})} 
            </div>
        )
    }

    render_sent_received_messages(){
        var middle = this.props.height-200;
        var size = this.props.size;
        if(size == 'm'){
            middle = this.props.height-100;
        }
        var items = this.get_convo_messages().reverse()
        var stacked_items = this.get_stacked_items().reverse()

        if(items.length == 0 && stacked_items.length == 0){
            items = [0,1]
            return(
                <div>
                    <div style={{overflow: 'auto', maxHeight: middle}}>
                        <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                            {items.map((item, index) => (
                                <li style={{'padding': '2px 5px 2px 5px'}} onClick={()=>console.log()}>
                                    <div style={{height:60, width:'100%', 'background-color': this.props.theme['card_background_color'], 'border-radius': '15px','padding':'10px 0px 10px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                                        <div style={{'margin':'10px 20px 10px 0px'}}>
                                            <img src={Letter} style={{height:30 ,width:'auto'}} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        }else{
            return(
                <div style={{overflow: 'auto', maxHeight: middle, 'display': 'flex', 'flex-direction': 'column-reverse'}}>
                    <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                        {items.reverse().map((item, index) => (
                            <li style={{'padding': '2px 5px 2px 5px'}} onClick={()=>console.log()}>
                                <div key={index}>
                                    {this.render_stack_message_item(item)}  
                                    <div style={{height:3}}/>
                                </div>
                            </li> 
                        ))}
                        
                        {stacked_items.reverse().map((item, index) => (
                            <li style={{'padding': '2px 5px 2px 5px', 'opacity':'0.6'}} onClick={()=>console.log()}>
                                <div >
                                    {this.render_stack_message_item(item)} 
                                    <div style={{height:3}}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    render_stack_message_item(item){
        if(item.type == 'message'){
            return(
                <div style={{'padding': '7px 15px 10px 15px','margin':'0px 0px 0px 0px', 'background-color': this.props.theme['view_group_card_item_background'],'border-radius': '7px'}}>
                    
                    <div className="row" style={{'padding':'0px 0px 0px 0px'}}>
                          <div className="col-9" style={{'padding': '0px 0px 0px 14px', 'height':'20px' }}> 
                            <p style={{'color': this.props.theme['primary_text_color'], 'font-size': '14px', 'margin':'0px'}} >{item['sender']}</p>
                          </div>
                          <div className="col-3" style={{'padding': '0px 15px 0px 0px','height':'20px'}}>
                            <p style={{'color': this.props.theme['secondary_text_color'], 'font-size': '9px', 'margin': '3px 0px 0px 0px'}} className="text-end">{this.get_time_difference(item['time'])}</p>
                          </div>
                    </div>
                    <p style={{'font-size': '11px','color': this.props.theme['secondary_text_color'],'margin': '0px 0px 0px 0px','font-family': 'Sans-serif','text-decoration': 'none', 'white-space': 'pre-line'}}>{this.format_message(item['message'])}</p>
                </div>
            )
        }else{
            return(
                <div style={{'padding': '7px 15px 10px 15px','margin':'0px 0px 0px 0px', 'background-color': this.props.theme['view_group_card_item_background'],'border-radius': '7px'}}>
                    
                    <div className="row" style={{'padding':'0px 0px 0px 0px'}}>
                          <div className="col-9" style={{'padding': '0px 0px 0px 14px', 'height':'20px' }}> 
                            <p style={{'color': this.props.theme['primary_text_color'], 'font-size': '14px', 'margin':'0px'}} >{item['sender']}</p>
                          </div>
                          <div className="col-3" style={{'padding': '0px 15px 0px 0px','height':'20px'}}>
                            <p style={{'color': this.props.theme['secondary_text_color'], 'font-size': '9px', 'margin': '3px 0px 0px 0px'}} className="text-end">{this.get_time_difference(item['time'])}</p>
                          </div>
                    </div>
                    <p style={{'font-size': '11px','color': this.props.theme['secondary_text_color'],'margin': '0px 0px 0px 0px','font-family': 'Sans-serif','text-decoration': 'none', 'white-space': 'pre-line'}}>{this.format_message(item['message'])}</p>

                    {this.render_detail_item('9',item['image-data'])}
                </div>
            )
        }
    }

    format_message(message){
        if(message == ''){
            return '...'
        }
        return message
    }

    get_convo_messages(){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        return this.props.app_state.object_messages[object['id']]
    }

    get_stacked_items(){
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var convo_id = object['id']

        var stack = this.props.app_state.stack_items
        var stacked_items = []
        for(var i=0; i<stack.length; i++){
            if(stack[i].type == 'proposal-messages'){
                for(var e=0; e<stack[i].messages_to_deliver.length; e++){
                    var message_obj = stack[i].messages_to_deliver[e]
                    if(message_obj['id'] == convo_id){
                        stacked_items.push(message_obj)
                    }
                }
            }
        }
        return stacked_items
    }

    render_image_picker(){
        return(
            <div>
                <div style={{'position': 'relative', 'width':45, 'height':45, 'padding':'0px 0px 0px 0px'}}>
                    <img src={E5EmptyIcon3} style={{height:45, width:'auto', 'z-index':'1' ,'position': 'absolute'}} />
                    <input style={{height:30, width:40, opacity:0, 'z-index':'2' ,'position': 'absolute', 'margin':'5px 0px 0px 0px'}} id="upload" type="file" accept ="image/*" onChange ={this.when_image_gif_picked.bind(this)}/>
                </div>
            </div>
        )
    }

    /* called when images have been picked from picker */
    when_image_gif_picked = (e) => {
        if(e.target.files && e.target.files[0]){
            for(var i = 0; i < e.target.files.length; i++){ 
                let reader = new FileReader();
                reader.onload = function(ev){
                    var image = ev.target.result
                    this.add_image_to_stack(image)
                }.bind(this);
                reader.readAsDataURL(e.target.files[i]);
            }
            // var image = e.target.files.length == 1 ? 'image has' : 'images have';
            // this.props.notify('Your selected '+e.target.files.length+image+' been staged.',500);
        }
    }

    when_entered_text_input_field_changed(text){
        this.setState({entered_text: text})
    }

    add_message_to_stack(){
        var message = this.state.entered_text.trim()
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        if(message == ''){
            this.props.notify('type something first', 600)
        }
        else if(this.props.app_state.user_account_id == 1){
            this.props.notify('you need to make at least 1 transaction to participate', 1200)
        }
        else{
            var tx = {'id':object['id'], type:'message', entered_indexing_tags:['send', 'message'], 'message':message, 'sender':this.props.app_state.user_account_id, 'time':Date.now()/1000}

            this.props.add_proposal_message_to_stack_object(tx)

            this.setState({entered_text:''})
            this.props.notify('message added to stack', 600)
            
            // if (this.messagesEnd.current){
            //     this.messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
            // }
        }
    }

    add_image_to_stack(image){
        if(this.props.app_state.user_account_id == 1){
            this.props.notify('you need to make at least 1 transaction to participate', 1200)
            return
        }
        var message = this.state.entered_text.trim()
        var object = this.get_proposal_items()[this.props.selected_proposal_item]
        var tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':[image],'pos':0}, 'sender':this.props.app_state.user_account_id,'time':Date.now()/1000}

        this.props.add_proposal_message_to_stack_object(tx)

        this.setState({entered_text:''})
        this.props.notify('message added to stack', 600)

        // if (this.messagesEnd.current){
        //     this.messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
        // }
    }















    /* renders the specific element in the post or detail object */
    render_detail_item(item_id, object_data){
        var size = this.props.screensize
        var width = size == 'm' ? this.props.app_state.width/2 : this.props.app_state.width
        return(
            <div>
                <ViewGroups item_id={item_id} object_data={object_data}  theme={this.props.theme} width={width}/>
            </div>
        )

    }


    format_account_balance_figure(amount){
        if(amount == null){
            amount = 0;
        }
        if(amount < 1_000_000_000){
            return number_with_commas(amount.toString())
        }else{
            var power = amount.toString().length - 9
            return number_with_commas(amount.toString().substring(0, 9)) +'e'+power
        }
        
    }

    get_number_width(number){
        var last_two_digits = number.toString().slice(0, 1)+'0';
        if(number > 10){
            last_two_digits = number.toString().slice(0, 2);
        }
        return last_two_digits+'%'
    }

    calculate_bar_width(amount){
        var figure = ''
        if(amount == null){
            amount = 0
        }
        if(amount < bigInt('1e9')){
            figure = Math.round((amount.toString().length * 100) / bigInt('1e9').toString().length)
        }
        else if(amount < bigInt('1e18')){
            figure = Math.round((amount.toString().length * 100) / bigInt('1e18').toString().length)
        }
        else if(amount < bigInt('1e36')){
            figure = Math.round((amount.toString().length * 100) / bigInt('1e36').toString().length)
        }
        else{
            figure = Math.round((amount.toString().length * 100) / bigInt('1e72').toString().length)
        }

        return figure+'%'
    }

    format_power_figure(amount){
        var power = 'e72'
        if(amount < bigInt('1e9')){
            power = 'e9'
        }
        else if(amount < bigInt('1e18')){
            power = 'e18'
        }
        else if(amount < bigInt('1e36')){
            power = 'e36'
        }
        else{
            power = 'e72'
        }
        return power
    }

    format_proportion(proportion){
        return ((proportion/10**18) * 100)+'%';
    }

    /* gets a formatted time diffrence from now to a given time */
    get_time_difference(time){
        var number_date = Math.round(parseInt(time));
        var now = Math.round(new Date().getTime()/1000);

        var diff = now - number_date;
        return this.get_time_diff(diff)
    }

    get_time_from_now(time){
        var number_date = Math.round(parseInt(time));
        var now = Math.round(new Date().getTime()/1000);

        var diff = number_date - now;
        return this.get_time_diff(diff)
    }

    get_time_diff(diff){
        if(diff < 60){//less than 1 min
            var num = diff
            var s = num > 1 ? 's': '';
            return num+ ' sec'
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
            return number_with_commas(num) + ' yr' + s;
        }
    }


}




export default ProposalDetailsSection;