import React, { Component } from 'react';
import ViewGroups from './../components/view_groups'
import Tags from './../components/tags';
import TextInput from './../components/text_input';

// import Letter from './../assets/letter.png';
// import E5EmptyIcon from './../assets/e5empty_icon.png';
// import E5EmptyIcon3 from './../assets/e5empty_icon3.png';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import imageCompression from 'browser-image-compression';

var bigInt = require("big-integer");

function bgN(number, power) {
  return bigInt((number+"e"+power)).toString();
}

function number_with_commas(x) {
    if(x == null) x = '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class AddCommentPage extends Component {
    
    state = {
        selected: 0, object: null, focused_message_id: 0, page: '', contractor_object: null,
        entered_title_text:'', entered_image_objects:[],
    };

    render(){
        return(
            <div style={{'padding':'10px 10px 0px 10px'}}>
                {this.render_everything()}
            </div>
        )
    }


    render_everything(){
        var size = this.props.app_state.size

        if(size == 's'){
            return(
                <div>
                    {this.render_content()}
                </div>
            )
        }
        else if(size == 'm'){
            return(
                <div className="row">
                    <div className="col-6" style={{'padding': '10px 10px 10px 10px'}}>
                        {this.render_content()}
                    </div>
                    <div className="col-6" style={{'padding': '10px 10px 10px 10px'}}>
                        {this.render_empty_views(3)}
                    </div>
                </div>
                
            )
        }
        else if(size == 'l'){
            return(
                <div className="row">
                    <div className="col-5" style={{'padding': '10px 10px 10px 10px'}}>
                        {this.render_content()}
                    </div>
                    <div className="col-5" style={{'padding': '10px 10px 10px 10px'}}>
                        {this.render_empty_views(3)}
                    </div>
                </div>
                
            )
        }
    }

    render_empty_views(size){
        var items = []
        for(var i=0; i<size; i++){
            items.push(i)
        }
        
        return(
            <div>
                <ul style={{ 'padding': '0px 0px 0px 0px', 'list-style':'none'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '2px'}}>
                            <div style={{height:60, width:'100%', 'background-color': this.props.theme['card_background_color'], 'border-radius': '15px','padding':'10px 0px 10px 10px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                                <div style={{'margin':'10px 20px 10px 0px'}}>
                                    <img src={this.props.app_state.static_assets['letter']} style={{height:30 ,width:'auto'}} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    render_content(){
        return(
            <div>
                {this.render_detail_item('4',{'font':this.props.app_state.font, 'textsize':'16px','text':this.props.app_state.loc['1038']/* 'Detailed message.' */})}
                <div style={{height:10}}/>
                <TextInput font={this.props.app_state.font} height={110} placeholder={this.props.app_state.loc['1039']/* 'Enter Message...' */} when_text_input_field_changed={this.when_title_text_input_field_changed.bind(this)} text={this.state.entered_title_text} theme={this.props.theme}/> 
                {this.render_detail_item('0')}

                {this.render_detail_item('4',{'font':this.props.app_state.font, 'textsize':'13px','text':this.props.app_state.loc['145']/* 'Black stages gif, grey stages image and tap to remove.' */})}
                {this.render_detail_item('10',{'font':this.props.app_state.font, 'textsize':'10px','text':this.props.app_state.loc['146']/* 'Images larger than 500Kb will be ignored.' */})}
                {this.render_create_image_ui_buttons_part()}
                {this.render_image_part()}

                <div style={{'padding': '5px 0px 0px 0px'}} onClick={()=>this.finish()}>
                    {this.render_detail_item('5', {'text':this.props.app_state.loc['4']/* 'Finish' */, 'action':'-'})}
                </div>
            </div>
        )
    }

    when_title_text_input_field_changed(text){
        this.setState({entered_title_text: text})
    }



    render_create_image_ui_buttons_part(){
        return(
            <div style={{'display': 'flex','flex-direction': 'row','margin':'0px 0px 0px 0px','padding': '7px 5px 10px 10px', width: '99%'}}>
                {/* <div style={{'position': 'relative', 'width':45, 'height':45, 'padding':'0px 0px 0px 0px'}}>
                    <img src={this.props.app_state.static_assets['e5_empty_icon']} style={{height:45, width:'auto', 'z-index':'1' ,'position': 'absolute'}} />
                    <input style={{height:30, width:40, opacity:0, 'z-index':'2' ,'position': 'absolute', 'margin':'5px 0px 0px 0px'}} id="upload" type="file" accept =".gif" onChange ={this.when_image_gif_picked.bind(this)} multiple/>
                </div> */}

                <div style={{'position': 'relative', 'width':45, 'height':45, 'padding':'0px 0px 0px 0px'}}>
                    <img src={this.props.app_state.static_assets['e5_empty_icon3']} style={{height:45, width:'auto', 'z-index':'1' ,'position': 'absolute'}} />
                    <input style={{height:30, width:40, opacity:0, 'z-index':'2' ,'position': 'absolute', 'margin':'5px 0px 0px 0px'}} id="upload" type="file" accept ="image/*" onChange ={this.when_image_gif_picked.bind(this)} multiple/>
                </div>

            </div>
        )
    }


    /* called when images have been picked from picker */
    when_image_gif_picked = (e) => {
        if(e.target.files && e.target.files[0]){
            for(var i = 0; i < e.target.files.length; i++){ 
                let reader = new FileReader();
                reader.onload = async function(ev){
                    const clonedArray = this.state.entered_image_objects == null ? [] : this.state.entered_image_objects.slice();
                    if(ev.total < this.props.app_state.image_size_limit){
                        clonedArray.push(ev.target.result);
                        this.setState({entered_image_objects: clonedArray});
                    }
                }.bind(this);
                var imageFile = e.target.files[i];
                imageCompression(imageFile, { maxSizeMB: 0.35, maxWidthOrHeight: 1920, useWebWorker: true }).then(function (compressedFile) {
                    reader.readAsDataURL(compressedFile);
                })
                .catch(function (error) {
                    console.log(error.message);
                });
            }
            var image = e.target.files.length == 1 ? 'image has' : 'images have';
            // this.props.notify('Your selected '+e.target.files.length+image+' been added.',500);
        }
    }

    render_image_part(){
        var col = Math.round(400 / 100)
        var rowHeight = 100;

        if(this.state.entered_image_objects.length == 0){
            var items = ['1','1','1']
            var background_color = this.props.theme['card_background_color']
            return(
                <div>
                    <ImageList sx={{ width: 400, height: 'auto' }} cols={col} rowHeight={rowHeight}>
                        {items.map((item, index) => (
                            <ImageListItem key={item.img}>
                                <div style={{height:100, width:100, 'background-color': background_color, 'border-radius': '5px','padding':'10px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                                    <div style={{'margin':'0px 0px 0px 0px'}}>
                                        <img src={this.props.app_state.static_assets['letter']} style={{height:40 ,width:'auto'}} />
                                    </div>
                                    
                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            )
        }else{
            var items = [].concat(this.state.entered_image_objects)
            var background_color = this.props.theme['card_background_color']
            return(
                <div>
                    <ImageList sx={{ width: 'auto', height: 'auto' }} cols={col} rowHeight={rowHeight}>
                        {items.map((item, index) => (
                            <ImageListItem key={item.img}>
                                <div onClick={() => this.when_image_clicked(index)}>
                                    <img src={item} style={{height:100 ,width:100}} />
                                </div> 
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            )
        }
    }

    when_image_clicked(index){
        var cloned_array = this.state.entered_image_objects.slice()
        if (index > -1) { // only splice array when item is found
            cloned_array.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.setState({entered_image_objects: cloned_array})
    }











    set_comment_data(object, focused_message_id, page, contractor_object){
        this.setState({object: object, focused_message_id: focused_message_id, page: page, contractor_object: contractor_object})
    }


    finish(){
        var object = this.state.object
        if(this.props.app_state.user_account_id[object['e5']] == 1){
            this.props.notify(this.props.app_state.loc['1040']/* 'You need to make at least 1 transaction to participate.' */, 1200)
            return
        }
        var message = this.state.entered_title_text.trim()
        var message_id = Date.now()
        var focused_message_id = this.state.focused_message_id

        if(message == ''){
            this.props.notify(this.props.app_state.loc['1041']/* 'Type something.' */, 700)
            return
        }
        var tx = {};
        var page = this.state.page
        if(page == 'channel'){
            tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0}, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'message_id':message_id, 'focused_message_id':focused_message_id, 'e5':object['e5']}
        }
        else if(page == 'job'){
            tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0}, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'message_id':message_id, 'focused_message_id':focused_message_id, 'e5':object['e5']}
        }
        else if(page == 'mail'){
            var mail = object;
            var convo_id = mail['convo_id']
            tx = {convo_id: convo_id, type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0}, 'sender':this.props.app_state.user_account_id[mail['e5']], 'recipient':mail['convo_with'],'time':Date.now()/1000, 'message_id':message_id, 'focused_message_id':focused_message_id, 'e5':mail['e5']}
        }
        else if(page == 'post'){
            tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0,}, 'message_id':message_id, 'focused_message_id':focused_message_id, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'e5':object['e5']}
        }
        else if(page == 'proposal'){
            tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0,}, 'message_id':message_id, 'focused_message_id':focused_message_id, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'e5':object['e5']}
        }
        else if(page == 'storefront'){
            tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0}, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'message_id':message_id, 'focused_message_id':focused_message_id, 'e5':object['e5']}
        }
        else if(page == 'bag'){
            tx = {'id':object['id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0}, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'message_id':message_id, 'focused_message_id':focused_message_id, 'e5':object['e5']}
        }
        else if(page == 'request'){
            tx = {'id':object['job_request_id'], type:'image', 'message': message, entered_indexing_tags:['send', 'image'], 'image-data':{'images':this.state.entered_image_objects,'pos':0}, 'sender':this.props.app_state.user_account_id[object['e5']],'time':Date.now()/1000, 'message_id':message_id, 'focused_message_id':focused_message_id, 'contractor_id':this.state.contractor_object, 'e5':object['e5']}
        }

        this.props.add_comment_to_respective_forum_page(tx, page)
        this.setState({entered_title_text: '', entered_image_objects:[]})
        this.props.notify(this.props.app_state.loc['1042']/* 'Message added to stack.' */, 1600)
    }









    /* renders the specific element in the post or detail object */
    render_detail_item(item_id, object_data){
        return(
            <div>
                <ViewGroups graph_type={this.props.app_state.graph_type} font={this.props.app_state.font} item_id={item_id} object_data={object_data} theme={this.props.theme} width={this.props.app_state.width} />
            </div>
        )

    }


}




export default AddCommentPage;