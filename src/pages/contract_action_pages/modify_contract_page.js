import React, { Component } from 'react';
import ViewGroups from '../../components/view_groups'
import Tags from '../../components/tags';
import TextInput from '../../components/text_input';
import NumberPicker from '../../components/number_picker';

import Letter from '../../assets/letter.png';

var bigInt = require("big-integer");

function bgN(number, power) {
  return bigInt((number+"e"+power)).toString();
}

function number_with_commas(x) {
    if(x == null) x = '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

class ModifyContractPage extends Component {
    
    state = {
        selected: 0,id:makeid(8),type:'modify-contract', entered_indexing_tags:['modify', 'contract', 'auth'],
        contract_item:{'data':[[],[0,0,0,0,0,0,0], [],[],[]]}, modify_contract_title_tags_object:this.get_modify_contract_title_tags_object(), reconfig_items_tags_object: this.get_reconfig_items_tags_object(),

        auto_wait_tags_object:this.get_auto_wait_tags_object(),
        can_modify_contract_as_moderator: this.get_can_modify_contract_as_moderator(),
        can_extend_enter_contract_at_any_time: this.get_can_extend_enter_contract_at_any_time(),
        bounty_limit_type: this.get_bounty_limit_type(),
        contract_force_exit_enabled: this.get_contract_force_exit_enabled(),

        reconfig_number:0, reconfig_proportion:0, reconfig_duration:0, reconfig_target_id:'',
        reconfig_values:[],
    };

    get_modify_contract_title_tags_object(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','modify-contract'], [1]
            ],
        };
    }

    get_reconfig_items_tags_object(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','Vote Bounty Split Proportion','Maximum Extend Enter Contract Limit', 'Minimum End Bounty Amount', 'Proposal Expiry Duration Limit', 'Maximum Enter Contract Duration', 'Auto Wait', 'Proposal Modify Expiry Duration Limit', 'Moderator Modify Privelage', 'Unlimited Extend Contract Time', 'Maximum Proposal Expiry Submit Expiry time difference', 'Bounty Limit Type', 'Force Exit Enabled', 'Minimum Spend Bounty Amount'], [1]
            ],
        };
    }

    get_auto_wait_tags_object(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','no', 'yes'], [1]
            ],
        };
    }

    get_can_modify_contract_as_moderator(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','modifiable', 'non-modifiable'], [1]
            ],
        };
    }

    get_can_extend_enter_contract_at_any_time(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','enabled', 'disabled'], [1]
            ],
        };
    }

    get_bounty_limit_type(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','relative', 'absolute'], [2]
            ],
        };
    }

    get_contract_force_exit_enabled(){
        return{
            'i':{
                active:'e', 
            },
            'e':[
                ['xor','',0], ['e','enabled', 'disabled'], [1]
            ],
        };
    }

    render(){
        return(
            <div style={{'padding':'10px 20px 0px 10px'}}>

                <div className="row">
                    <div className="col-9" style={{'padding': '5px 0px 0px 10px'}}>
                        <Tags page_tags_object={this.state.modify_contract_title_tags_object} tag_size={'l'} when_tags_updated={this.when_modify_contract_title_tags_object_updated.bind(this)} theme={this.props.theme}/>
                    </div>
                    <div className="col-3" style={{'padding': '0px 0px 0px 0px'}}>
                        <div style={{'padding': '5px'}} onClick={()=>this.finish()}>
                            {this.render_detail_item('5', {'text':'Finish', 'action':''})}
                        </div>
                    </div>
                </div>

                {this.render_everything()}

            </div>
        )
    }

    when_modify_contract_title_tags_object_updated(tag_obj){
        this.setState({modify_contract_title_tags_object: tag_obj})
    }


    render_everything(){
        return(
            <div>
                {this.render_detail_item('4', {'font':'Sans-serif', 'textsize':'13px', 'text':'Make changes to the configuration of the contract ID: '+this.state.contract_item['id']})}

                {this.render_detail_item('0')}

                <Tags page_tags_object={this.state.reconfig_items_tags_object} tag_size={'l'} when_tags_updated={this.when_reconfig_items_tags_object_object_updated.bind(this)} theme={this.props.theme}/>
                <div style={{height:10}}/>
                {this.load_reconfig_item_selectors()}
                <div style={{height:20}}/>

                {this.load_reconfig_items()}
            </div>
        )
    }

    get_selected_item(object, option){
        var selected_item = object[option][2][0]
        var picked_item = object[option][1][selected_item];
        return picked_item
    }


    when_reconfig_items_tags_object_object_updated(tag_obj){
        this.setState({reconfig_items_tags_object: tag_obj})
    }

    load_reconfig_item_selectors(){
        var selected_item = this.get_selected_item(this.state.reconfig_items_tags_object, this.state.reconfig_items_tags_object['i'].active)


        if(selected_item == 'e'){
            return(<div></div>)
        }

        var properties = this.get_target_configuration(selected_item)
        var ui = properties['picker']
        if(ui == 'number'){
            return(
                <div>
                    <div style={{'background-color': this.props.theme['card_background_color'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                        {this.render_detail_item('2', { 'style':'l', 'title':selected_item, 'subtitle':this.format_power_figure(this.state.reconfig_number), 'barwidth':this.calculate_bar_width(this.state.reconfig_number), 'number':this.format_account_balance_figure(this.state.reconfig_number), 'barcolor':'', 'relativepower':'units', })}
                    </div>

                    <div style={{height:10}}/>
                    {this.render_current_items(properties, selected_item)}

                    <NumberPicker number_limit={bigInt('1e72')} when_number_picker_value_changed={this.when_amount_changed.bind(this)} theme={this.props.theme} power_limit={properties['powerlimit']}/>

                    <div style={{height:20}}/>
                    <div style={{'padding': '5px'}} onClick={()=>this.add_reconfiguration_item()}>
                        {this.render_detail_item('5', {'text':'Add Change', 'action':''})}
                    </div>
                </div>
            )
        }
        else if(ui == 'proportion'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.format_proportion(this.state.reconfig_proportion), 'details':selected_item, 'size':'l'})}

                    <div style={{height:10}}/>
                    {this.render_current_items(properties, selected_item)}

                    <NumberPicker number_limit={bigInt('1e72')} when_number_picker_value_changed={this.when_proportion_changed.bind(this)} power_limit={properties['powerlimit']} theme={this.props.theme} />

                    <div style={{height:20}}/>
                    <div style={{'padding': '5px'}} onClick={()=>this.add_reconfiguration_item()}>
                        {this.render_detail_item('5', {'text':'Add Change', 'action':''})}
                    </div>
                </div>
            )
        }
        else if(ui == 'time'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.get_time_diff(this.state.reconfig_duration), 'details':selected_item, 'size':'l'})}

                    <div style={{height:10}}/>
                    {this.render_current_items(properties, selected_item)}

                    <NumberPicker number_limit={bigInt('1e72')} when_number_picker_value_changed={this.when_time_changed.bind(this)} theme={this.props.theme} power_limit={properties['powerlimit']}/>
                    <div style={{height:20}}/>
                    <div style={{'padding': '5px'}} onClick={()=>this.add_reconfiguration_item()}>
                        {this.render_detail_item('5', {'text':'Add Change', 'action':''})}
                    </div>
                </div>
            )
        }
        else if(ui == 'tag'){
            return(
                <div>
                    {this.load_tags_ui()}

                    <div style={{height:10}}/>
                    {this.render_current_items(properties, selected_item)}

                    <div style={{'padding': '5px'}} onClick={()=>this.add_reconfiguration_item()}>
                        {this.render_detail_item('5', {'text':'Add Change', 'action':''})}
                    </div>
                </div>
            )
        }
        else if(ui == 'id'){
            return(
                <div>
                    <TextInput height={30} placeholder={'Target ID...'} when_text_input_field_changed={this.when_reconfig_target_id_text_input_field_changed.bind(this)} text={this.state.reconfig_target_id} theme={this.props.theme}/>

                    {this.load_account_suggestions('reconfig_target_id')}

                    <div style={{height:10}}/>
                    {this.render_current_items(properties, selected_item)}

                    <div style={{height:20}}/>
                    <div style={{'padding': '5px'}} onClick={()=>this.add_reconfiguration_item()}>
                        {this.render_detail_item('5', {'text':'Add Change', 'action':''})}
                    </div>
                </div>
            )
        }
    }

    render_current_items(properties, selected_item){
        var ui = properties['picker']
        var current_value = this.state.contract_item['data'][properties['position'][0]][properties['position'][1]]
        if(ui == 'number'){
            return(
                <div>
                    <div style={{'background-color': this.props.theme['card_background_color'], 'box-shadow': '0px 0px 0px 0px '+this.props.theme['card_shadow_color'],'margin': '0px 0px 0px 0px','padding': '10px 5px 5px 5px','border-radius': '8px' }}>
                        {this.render_detail_item('2', { 'style':'l', 'title':'Current '+selected_item, 'subtitle':this.format_power_figure(current_value), 'barwidth':this.calculate_bar_width(current_value), 'number':this.format_account_balance_figure(current_value), 'barcolor':'', 'relativepower':'units', })}
                    </div>
                </div>
            )
        }
        else if(ui == 'proportion'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.format_proportion(current_value), 'details':'Current '+selected_item, 'size':'l'})}
                </div>
            )
        }
        else if(ui == 'time'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.get_time_diff(current_value), 'details':'Current Value', 'size':'l'})}
                </div>
            )
        }
        else if(ui == 'tag'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':this.get_tag_selected_item(selected_item, current_value), 'details':'Current Value', 'size':'l'})}
                </div>
            )
        }
        else if(ui == 'id'){
            return(
                <div>
                    {this.render_detail_item('3', {'title':current_value, 'details':'Current Value', 'size':'l'})}
                </div>
            )
        } 
    }

    when_amount_changed(number){
        this.setState({reconfig_number: number})
    }

    when_proportion_changed(number){
        this.setState({reconfig_proportion: number})
    }

    when_time_changed(number){
        this.setState({reconfig_duration: number})
    }

    when_reconfig_target_id_text_input_field_changed(text){
        this.setState({reconfig_target_id: text})
    }

    get_target_configuration(property){
        var obj = {
            'Vote Bounty Split Proportion':{'position':[1,1], 'picker':'proportion', 'powerlimit':9},
            'Maximum Extend Enter Contract Limit':{'position':[1,2], 'picker':'time', 'powerlimit':63}, 
            'Minimum End Bounty Amount':{'position':[1,4], 'picker':'number', 'powerlimit':63}, 
            'Proposal Expiry Duration Limit':{'position':[1,5], 'picker':'time', 'powerlimit':63}, 
            'Maximum Enter Contract Duration':{'position':[1,6], 'picker':'time', 'powerlimit':63}, 
            'Auto Wait':{'position':[1,8], 'picker':'tag', 'powerlimit':63}, 
            'Proposal Modify Expiry Duration Limit':{'position':[1,27], 'picker':'time', 'powerlimit':63},
            'Moderator Modify Privelage':{'position':[1,28], 'picker':'tag', 'powerlimit':9}, 
            'Unlimited Extend Contract Time':{'position':[1,29], 'picker':'tag', 'powerlimit':9}, 
            'Maximum Proposal Expiry Submit Expiry time difference':{'position':[1,36], 'picker':'time', 'powerlimit':63}, 
            'Bounty Limit Type':{'position':[1,37], 'picker':'tag', 'powerlimit':9}, 
            'Force Exit Enabled':{'position':[1,38], 'picker':'tag', 'powerlimit':9}, 
            'Minimum Spend Bounty Amount':{'position':[1,10], 'picker':'number', 'powerlimit':63},
        }

        return obj[property]
    }


    load_tags_ui(){
        var selected_item = this.get_selected_item(this.state.reconfig_items_tags_object, this.state.reconfig_items_tags_object['i'].active)

        if(selected_item == 'Auto Wait'){
            return(
                <div>
                    {this.render_detail_item('4', {'text':selected_item, 'textsize':'15px', 'font':'Sans-serif'})}

                    <div style={{height:20}}/>
                    <Tags page_tags_object={this.state.auto_wait_tags_object} tag_size={'l'} when_tags_updated={this.when_auto_wait_tags_object.bind(this)} theme={this.props.theme}/>
                </div>
            )
        }
        else if(selected_item == 'Moderator Modify Privelage'){
            return(
                <div>
                    {this.render_detail_item('4', {'text':selected_item, 'textsize':'15px', 'font':'Sans-serif'})}

                    <div style={{height:20}}/>
                    <Tags page_tags_object={this.state.can_modify_contract_as_moderator} tag_size={'l'} when_tags_updated={this.when_can_modify_contract_as_moderator.bind(this)} theme={this.props.theme}/>
                </div>
            )
        }
        else if(selected_item == 'Unlimited Extend Contract Time'){
            return(
                <div>
                    {this.render_detail_item('4', {'text':selected_item, 'textsize':'15px', 'font':'Sans-serif'})}

                    <div style={{height:20}}/>
                    <Tags page_tags_object={this.state.can_extend_enter_contract_at_any_time} tag_size={'l'} when_tags_updated={this.when_can_extend_enter_contract_at_any_time.bind(this)} theme={this.props.theme}/>
                </div>
            )
        }
        else if(selected_item == 'Bounty Limit Type'){
            return(
                <div>
                    {this.render_detail_item('4', {'text':selected_item, 'textsize':'15px', 'font':'Sans-serif'})}

                    <div style={{height:20}}/>
                    <Tags page_tags_object={this.state.bounty_limit_type} tag_size={'l'} when_tags_updated={this.when_bounty_limit_type.bind(this)} theme={this.props.theme}/>
                </div>
            )
        }
        else if(selected_item == 'Force Exit Enabled'){
            return(
                <div>
                    {this.render_detail_item('4', {'text':selected_item, 'textsize':'15px', 'font':'Sans-serif'})}

                    <div style={{height:20}}/>
                    <Tags page_tags_object={this.state.contract_force_exit_enabled} tag_size={'l'} when_tags_updated={this.when_contract_force_exit_enabled.bind(this)} theme={this.props.theme}/>
                </div>
            )
        }
    }

    when_auto_wait_tags_object(tag_obj){
        this.setState({auto_wait_tags_object: tag_obj})
    }

    when_can_modify_contract_as_moderator(tag_obj){
        this.setState({can_modify_contract_as_moderator: tag_obj})
    }

    when_can_extend_enter_contract_at_any_time(tag_obj){
        this.setState({can_extend_enter_contract_at_any_time: tag_obj})
    }

    when_bounty_limit_type(tag_obj){
        this.setState({bounty_limit_type: tag_obj})
    }

    when_contract_force_exit_enabled(tag_obj){
        this.setState({contract_force_exit_enabled: tag_obj})
    }


    add_reconfiguration_item(){
        var selected_item = this.get_selected_item(this.state.reconfig_items_tags_object, this.state.reconfig_items_tags_object['i'].active)

        var properties = this.get_target_configuration(selected_item)
        var ui = properties['picker']
        var position = properties['position']
        var reconfig_vaules_clone = this.state.reconfig_values.slice()

        if(ui == 'number'){
            var number = this.state.reconfig_number;
            reconfig_vaules_clone.push({'value':number, 'pos':position, 'title': selected_item, 'type':ui})
            this.setState({reconfig_values: reconfig_vaules_clone, reconfig_number:0})
            this.props.notify('reconfig action added!', 600)
        }
        else if(ui == 'proportion'){
            var number = this.state.reconfig_proportion;
            reconfig_vaules_clone.push({'value':number, 'pos':position, 'title': selected_item, 'type':ui})
            this.setState({reconfig_values: reconfig_vaules_clone, reconfig_proportion: 0})
            this.props.notify('reconfig action added!', 600)
        }
        else if(ui == 'time'){
            var number = this.state.reconfig_duration;
            reconfig_vaules_clone.push({'value':number, 'pos':position, 'title': selected_item, 'type':ui})
            this.setState({reconfig_values: reconfig_vaules_clone, reconfig_duration:0})
            this.props.notify('reconfig action added!', 600)
        }
        else if(ui == 'tag'){
            var number = this.get_tag_value()
            reconfig_vaules_clone.push({'value':number, 'pos':position, 'title': selected_item, 'type':ui})
            this.setState({reconfig_values: reconfig_vaules_clone})
            this.props.notify('reconfig action added!', 600)
        }
        else if(ui == 'id'){
            var number = this.get_typed_alias_id(this.state.reconfig_target_id.trim())
            if(isNaN(number) || parseInt(number) < 0 || number == ''){
                this.props.notify('please put a valid account id', 600)
            }
            else{
                reconfig_vaules_clone.push({'value':number, 'pos':position, 'title': selected_item, 'type':ui})
                this.setState({reconfig_values: reconfig_vaules_clone, reconfig_duration:0})
                this.props.notify('reconfig action added!', 600)
            }
        }
    }

    get_typed_alias_id(alias){
        if(!isNaN(alias)){
            return alias
        }
        var id = (this.props.app_state.alias_owners[this.props.app_state.selected_e5][alias] == null ? 
            alias : this.props.app_state.alias_owners[this.props.app_state.selected_e5][alias])

        return id
    }


    get_tag_value(){
        var selected_item = this.get_selected_item(this.state.reconfig_items_tags_object, this.state.reconfig_items_tags_object['i'].active)

        if(selected_item == 'Auto Wait'){
            var item = this.get_selected_item(this.state.auto_wait_tags_object, this.state.auto_wait_tags_object['i'].active)
            var value = item == 'no' ? 0 : 1
            return value;
        }
        else if(selected_item == 'Moderator Modify Privelage'){
            var item = this.get_selected_item(this.state.can_modify_contract_as_moderator, this.state.can_modify_contract_as_moderator['i'].active)
            var value = item == 'non-modifiable' ? 0 : 1
            return value;
        }
        else if(selected_item == 'Unlimited Extend Contract Time'){
            var item = this.get_selected_item(this.state.can_extend_enter_contract_at_any_time, this.state.can_extend_enter_contract_at_any_time['i'].active)
            var value = item == 'disabled' ? 0 : 1
            return value;
        }
        else if(selected_item == 'Bounty Limit Type'){
            var item = this.get_selected_item(this.state.bounty_limit_type, this.state.bounty_limit_type['i'].active)
            var value = item == 'relative' ? 0 : 1
            return value;
        }
        else if(selected_item == 'Force Exit Enabled'){
            var item = this.get_selected_item(this.state.contract_force_exit_enabled, this.state.contract_force_exit_enabled['i'].active)
            var value = item == 'disabled' ? 0 : 1
            return value;
        }
    }


    load_reconfig_items(){
        var middle = this.props.height-100;
        var size = this.props.size;
        if(size == 'm'){
            middle = this.props.height-100;
        }
        var items = [].concat(this.state.reconfig_values)

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
        var obj = {'Auto Wait':{0:'no', 1:'yes'}, 'Moderator Modify Privelage':{1:'modifiable', 0:'non-modifiable'}, 'Unlimited Extend Contract Time':{1:'enabled', 0:'disabled'}, 'Bounty Limit Type':{0:'relative', 1:'absolute'}, 'Force Exit Enabled':{1:'enabled', 0:'disabled'}}

        return obj[title][number]
    }

    when_added_modify_item_clicked(item){
        var cloned_array = this.state.reconfig_values.slice()
        const index = cloned_array.indexOf(item);
        if (index > -1) { // only splice array when item is found
            cloned_array.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.setState({reconfig_values: cloned_array})
        this.props.notify('reconfig action removed!', 600)
    }


    load_account_suggestions(type){
        var items = [].concat(this.get_suggested_accounts(type))
        var background_color = this.props.theme['card_background_color']
        var card_shadow_color = this.props.theme['card_shadow_color']
        return(
            <div style={{'margin':'0px 0px 0px 5px','padding': '5px 0px 0px 0px', width: '97%', 'background-color': 'transparent'}}>
                <ul style={{'list-style': 'none', 'padding': '0px 0px 0px 0px', 'overflow': 'auto', 'white-space': 'nowrap', 'border-radius': '13px', 'margin':'0px 0px 0px 0px','overflow-y': 'hidden'}}>
                    {items.map((item, index) => (
                        <li style={{'display': 'inline-block', 'margin': '5px 5px 5px 5px', '-ms-overflow-style': 'none'}} onClick={() => this.when_suggestion_clicked(item, index, type)}>
                            {this.render_detail_item('3', item['label'])}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    get_suggested_accounts(type){
        if(type == 'reconfig_target_id'){
            return[
                {'id':'53', 'label':{'title':'My Account', 'details':'Account', 'size':'s'}},
            ]
        } 
    }

    get_account_suggestions(){
        var contacts = this.props.app_state.contacts[this.props.app_state.selected_e5]
        var return_array = []
        contacts.forEach(contact => {
            if(contact['id'].toString().includes(this.state.recipient_id)){
                return_array.push({'id':contact['id'],'label':{'title':contact['id'], 'details':this.get_contact_alias(contact), 'size':'s'}})
            }
        });
        return return_array;
    }

    get_contact_alias(contact){
        return (this.get_all_sorted_objects_mappings(this.props.app_state.alias_bucket)[contact['id']] == null ? ((contact['address'].toString()).substring(0, 9) + "...") : this.get_all_sorted_objects_mappings(this.props.app_state.alias_bucket)[contact['id']])
    }


    when_suggestion_clicked(item, pos, type){
        if(type == 'reconfig_target_id'){
            this.setState({reconfig_target_id: item['id']})
        }
    }










    set_contract(contract_item){
        if(this.state.contract_item['id'] != contract_item['id']){
            this.setState({
                selected: 0,id:makeid(8),type:'modify-contract', entered_indexing_tags:['modify', 'contract', 'auth'],
                contract_item:{'data':[[],[0,0,0,0,0,0,0], [],[],[]]}, modify_contract_title_tags_object:this.get_modify_contract_title_tags_object(), reconfig_items_tags_object: this.get_reconfig_items_tags_object(),
                auto_wait_tags_object:this.get_auto_wait_tags_object(),
                can_modify_contract_as_moderator: this.get_can_modify_contract_as_moderator(),
                can_extend_enter_contract_at_any_time: this.get_can_extend_enter_contract_at_any_time(),
                bounty_limit_type: this.get_bounty_limit_type(),
                contract_force_exit_enabled: this.get_contract_force_exit_enabled(),
                reconfig_number:0, reconfig_proportion:0, reconfig_duration:0, reconfig_target_id:'',
                reconfig_values:[],
            })
        }
        this.setState({contract_item: contract_item, e5: contract_item['e5']})
    }

    finish(){
        if(this.state.reconfig_values.length == 0){
            this.props.notify('you cant stack no changes', 700)
        }else{
            var clone = structuredClone(this.state)
            this.props.add_modify_contract_to_stack(clone)
            this.setState({reconfig_values:[]})
            this.props.notify('transaction added to stack', 700);
        }
    }




    /* renders the specific element in the post or detail object */
    render_detail_item(item_id, object_data){
        return(
            <div>
                <ViewGroups item_id={item_id} object_data={object_data} theme={this.props.theme} width={this.props.app_state.width} />
            </div>
        )

    }


    format_proportion(proportion){
        return ((proportion/10**18) * 100)+'%';
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

    calculate_bar_width(num){
        if(num == null) return '0%'
        var last_two_digits = num.toString().slice(0, 1)+'0';
        if(num > 10){
            last_two_digits = num.toString().slice(0, 2);
        }
        return last_two_digits+'%'
    }

    format_power_figure(amount){
        if(amount == null){
            amount = 0;
        }
        if(amount < 1_000_000_000){
            return 'e0'
        }
        else{
            var power = amount.toString().length - 9
            return 'e'+(power+1)
        }
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
            return num + ' yr' + s;
        }
    }

}




export default ModifyContractPage;