import React, { Component } from 'react';
import Background from './../assets/background.png'
import JobIconImg from './../assets/job_icon.png';  
import ExploreIconImg from './../assets/explore_icon.png'; 
import WalletIconImg from './../assets/wallet_icon.png'; 
import StackIconImg from './../assets/stack_icon.png';
import Letter from './../assets/letter.png'; 
import AddLetter from './../assets/add_icon.png';

import Tags from './../components/tags';

class home_page extends Component {
    
    state = {
        page: '?',
        work_page_tags_object:this.get_main_page_tag_object('?'), 
        explore_page_tags_object:this.get_main_page_tag_object('e'), 
        wallet_page_tags_object:this.get_main_page_tag_object('w'),
    };


    /* returns the tag object used for the main page */
    get_main_page_tag_object(page){
      if(page == '?'/* jobs_section */){
        return{
          'i':{
              active:'e', 
          },
          'e':[
              ['or','',0], ['e','e.contracts', 'e.proposals','e.subscriptions'], [0]
          ],
          'contracts':[
              ['or','e',1], ['contracts','all','viewed','created','received'], [1],[1]
          ],
          'proposals':[
              ['or','e',1], ['proposals','all','received','created','voted'], [1],[1]
          ],
          'subscriptions':[
              ['or','e',1], ['subscriptions','all','paid','created'], [1],[1]
          ],
          'my':[
              ['or','',0], ['my','carts','bags'], [1],[1]
          ],
        };
      }
      else if(page == 'e'/* content_section */){
        return{
          'i':{
              active:'e', 
          },
          'e':[
              ['or','',0], ['e','e.posts','e.channels','e.E5s'], [0]
          ],
          'posts':[
              ['or','',0], ['posts','all','viewed','created'], [1],[1]
          ],
          'channels':[
              ['or','',0], ['channels','all','viewed','created'], [1],[1]
          ],
          'E5s':[
              ['or','',0], ['E5s','info ℹ️','indexdata 📊','blockexplorer 🗺️', 'tipjar 🍯'], [1],[1]
          ]
        }
      }
      else{/* wallet_section */
        return{
          'i':{
              active:'e', 
          },
          'e':[
              ['or','',0], ['e','ethers ⚗️','ends ☝️','spends 🫰'],[0]
          ],
        }
      }
      
    }

    render(){
        var size = this.props.screensize;
        var top_bar = 50;
        var middle = this.props.height-126;
        var bottom_bar = 70;
        var width = this.props.width;
        var navbar_color = '#444444';// #444444
        var background_color = '#F1F1F1';//#F1F1F1


        if(size == 'm'){
            return ( 
                <div className="row" style={{height: this.props.height, width:'101%','background-color':background_color}}>
                    <div className="col" style={{backgroundImage: `url(${Background})` , backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                        <div style={{height:top_bar, width:width, 'padding':'9px 0px 0px 15px'}}>
                            {this.render_top_tag_bar(size)}
                        </div>
                        
                        <div style={{height:5}}/>
                        <div className="row" style={{height:middle, width:width, 'margin':'0px 0px 0px 3px'}}>
                            <div className="col-6">
                                {this.render_post_list_group(size)}
                            </div>
                            
                            <div className="col-6" style={{'padding':'0px 10px 0px 10px'}}>
                                {this.render_post_detail_object(size)}
                            </div>
                            
                        </div>
                        <div style={{height:5}}/>
                        <div style={{height:bottom_bar, width: '102%', 'background-color':  navbar_color, 'border-radius': '0px 0px 0px 0px', 'padding':'0px 0px 0px 0px'}}>
                            {this.render_navbar_button_group(size)}
                        </div>
                        
                    </div>
                </div>
            );
        }
        else if(size == 's'){
            return ( 
                <div style={{height: this.props.height, width:'100%','background-color':background_color, backgroundImage: `url(${Background})` , backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                    <div style={{height:top_bar, width:width, 'padding':'9px 0px 0px 0px'}}>
                        {this.render_top_tag_bar(size)}
                    </div>
                    
                    <div style={{height:this.props.height-123, width:width, 'padding':'0px 5px 0px 5px'}}  >
                        {this.render_post_list_group(size)}
                    </div>
                    
                    <div style={{height:5}}/>
                    <div style={{height:bottom_bar, width:width, 'background-color': navbar_color,'display':'flex', 'align-items': 'center', 'border-radius': '0px 0px 0px 0px', 'padding':'0px 0px 0px 15px'}}>
                        {this.render_navbar_button_group(size)}
                    </div>
                </div>
            );
        }
        else{
            return(
                <div style={{height: this.props.height, width:'100%','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <img src={Letter} style={{height:'auto',width:'35%'}} />
                </div>
            );
        }

    }


    render_navbar_button_group(size){
        //#545454 - highlight color

        if(size == 'm'){
          return ( 
              <div className="row" style={{'padding':'0px 0px 0px 10px', height:'100%', width:'100%'}}>
                  <div className="col" style={{'background-color': this.get_navbar_normal_or_highlighted_button_background('?'),'padding':'5px 0px 0px 30px', 'border-radius': '0px 0px 0px 0px'}} onClick={()=> this.when_bottom_navbar_button_clicked('?')}>
                      {this.render_navbar_button('l','1px 0px 0px 12px', JobIconImg, 'auto', '70px','3px 12px 3px 19px','????','44 tabs open')}
                  </div>

                  <div className="col" style={{'padding':'5px 0px 0px 30px','background-color': this.get_navbar_normal_or_highlighted_button_background('e')}} onClick={() => this.when_bottom_navbar_button_clicked('e')}>
                    {this.render_navbar_button('l','2px 0px 0px 3px', ExploreIconImg, 'auto', '60px','5px 11px 0px 20px','Explore','44 tabs open')}
                  </div>

                  <div className="col" style={{'padding':'5px 0px 0px 30px', 'background-color': this.get_navbar_normal_or_highlighted_button_background('w')}} onClick={() => this.when_bottom_navbar_button_clicked('w')}>
                    {this.render_navbar_button('l','2px 0px 0px 15px', WalletIconImg, 'auto', '70px','5px 10px 6px 17px','Wallet','3 wallets open')}
                  </div>
                  
                  <div className="col" style={{'padding':'5px 0px 0px 30px'}} onClick={() => this.when_bottom_navbar_button_clicked('s')}>
                    {this.render_navbar_button('l','2px 0px 0px 5px', StackIconImg, 'auto', '59px','3px 11px 2px 12px','Stack','6 transactions')}
                  </div>
              </div>
          );
        }
        else if(size == 's'){
          return(
            <div className="row" style={{'padding':'0px 0px 0px 0px','display':'flex', 'align-items': 'center', height:'100%', width:'100%'}}>
                  <div className="col" style={{height: '100%', width:'100%', padding:'0px 0px 0px 0px', 'background-color': this.get_navbar_normal_or_highlighted_button_background('?'),'border-radius': '1px 0px 0px 0px'}} onClick={() => this.when_bottom_navbar_button_clicked('?')}>
                      {this.render_navbar_button('s','0px 0px 0px 0px', JobIconImg, 'auto', '38px','5px 0px 0px 0px','????','44 tabs')}
                  </div>

                  <div className="col" style={{height: '100%', width:'100%', padding:'0px 0px 0px 1px', 'background-color': this.get_navbar_normal_or_highlighted_button_background('e')}} onClick={() => this.when_bottom_navbar_button_clicked('e')}>
                      {this.render_navbar_button('s','0px 0px 0px 0px', ExploreIconImg, 'auto', '30px','5px 0px 0px 0px','????','44 tabs')}
                  </div>

                  <div className="col" style={{height: '100%', width:'100%', padding:'0px 0px 0px 1px', 'background-color': this.get_navbar_normal_or_highlighted_button_background('w')}} onClick={() => this.when_bottom_navbar_button_clicked('w')}>
                    {this.render_navbar_button('s','0px 0px 0px 0px', WalletIconImg, 'auto', '42px','6px 0px 0px 0px','Wallet','44 tabs')}
                      
                  </div>

                  <div className="col" style={{height: '100%', width:'100%', padding:'5px 0px 0px 1px'}} onClick={() => this.when_bottom_navbar_button_clicked('s')}>
                    {this.render_navbar_button('s','0px 0px 0px 0px', StackIconImg, 'auto', '30px','3px 0px 0px 0px','Stack','44 tabs')}
                  </div>
              </div>
          );
        }
    }

    /* returns if button selected is highlighted */
    get_navbar_normal_or_highlighted_button_background(val){
      var color = 'transparent';
        if(val == this.state.page){
            color = '#545454';
        }
        return color;
    }

    /* called when a bottom navbar item has been clicked */
    when_bottom_navbar_button_clicked(item){
        if(item == 's'){
            console.log('stack item clicked');
            this.open_view_stack_bottomsheet();
        }
        else {
            this.setState({page: item});
        }
    }

    render_navbar_button(icontype, text_padding, img, img_height, img_width, img_padding, title, tabs){
      if(icontype == 's' || icontype == 'xs'){
            return (
                <div style={{height:'100%', width:'93%', 'padding':text_padding, 'text-align':'center', 'background-color':'transparent'}}>
                    <img src={img} style={{height:img_height,width:img_width, padding: img_padding}} />

                    <p style={{'font-size': '12px','color': 'white','margin': '0px 0px 0px 0px','font-family': 'Sans-serif','text-decoration': 'none', 'text-shadow': '-1px -1px 2px #BABABA'}}>{title}</p>

                    <p style={{'font-size': '8px','color': '#D1D1D1','margin': '0px 0px 0px 0px','font-family': 'Sans-serif','text-decoration': 'none', 'font-weight': 'bold'}} className="text-capitalize">{tabs}</p>
                </div>
            );
        }else{
            return ( 
                <div className="row" style={{ width:'100%', 'padding':'7px 0px 0px 10px', 'border-radius': '0px 0px 0px 0px'}}>
                    <div className="col-3" style={{'padding':'0px 0px 10px 0px'}}>
                        <div style={{height:'7%', width:'100%'}}>
                            <img src={img} style={{height:img_height,width:img_width, padding: img_padding}} />
                        </div>
                    </div>
                    <div className="col" style={{'padding':'0px 0px 0px 10px'}}>
                        <div style={{height:'7%', width:'100%', 'padding':text_padding}}>
                            <p style={{'font-size': '18px','color': 'white','margin': '0px 0px 0px 0px','font-family': 'Sans-serif','text-decoration': 'none', 'text-shadow': '-1px -1px 2px #BABABA'}}>{title}</p> 
                            <p style={{'font-size': '10px','color': '#D1D1D1','margin': '-5px 0px 0px 0px','font-family': 'Sans-serif','text-decoration': 'none', 'font-weight': 'bold'}} className="text-capitalize">{tabs}</p>
                        </div>
                    </div>
                </div> 
            );
        }
    }

    open_view_stack_bottomsheet(){

    }










    /* render the top bar tags with the create object button */
    render_top_tag_bar(size){
        var width = this.props.width - 80;
        if(size == 'l') width = this.props.width - 10;
        return(
            <div style={{'display': 'flex','flex-direction': 'row','padding': '0px 0px 0px 5px', height: 40,  width: '99%'}}>
                <div style={{ height: 40,  width: width}}>
                    {this.render_tag_bar_group(this.get_tag_group_option(),'l')}
                </div>
                
                <button style={{'text-decoration': 'none', 'border': 'none','background-color': 'transparent' ,'float': 'right', width: 70,'padding': '0px 0px 12px 0px', opacity:1}}>
                    {this.render_e_plus_button()}
                </button>
            </div>
        );
    }

    /* called when the eplus letter is clicked on the main page */
    when_e_plus_letter_clicked(){
      var button_target = this.get_e_plus_button_mapping();
      if(button_target != ''){
        this.open_new_object_bottomsheet();
      }
    }

    /* renders the e plus button and sets its opacity */
    render_e_plus_button(){
      var button_target = this.get_e_plus_button_mapping();
      var alpha = 1.0;
      if(button_target == ''){
        alpha = 0.2;
      }
      return(
        <img onClick={()=> this.when_e_plus_letter_clicked()} src={AddLetter} style={{height:36, width:'auto', opacity:alpha}} />
      )
    }

    /* gets the tag object id for creating new objects associated with the tag option active in the top bar */
    get_e_plus_button_mapping(){
      var active_page_tag_item = this.get_tag_group_option()['i'].active;
      var data = {'contracts':'6','jobs':'7','contractors':'8','storefronts':'9','E5tokens':'11','subscriptions':'12','posts':'13','channels':'14',};

      if(data[active_page_tag_item] == null) return ''
      return data[active_page_tag_item];
    }

    /* gets the option of tags to use depending on the bottom navbar button clicked */
    get_tag_group_option(){
      if(this.state.page == '?'){
        return this.state.work_page_tags_object
      }
      else if(this.state.page == 'e'){
        return this.state.explore_page_tags_object
      }
      else{
        return this.state.wallet_page_tags_object
      }
    }







    render_tag_bar_group(option, size){
        return(
            <div>
                <Tags page_tags_object={option} tag_size={size} when_tags_updated={this.when_tags_updated.bind(this)}/>
            </div>
        )
    }

    when_tags_updated(tag_group){
        if(this.state.page == '?'){
            return this.setState({work_page_tags_object: tag_group})
        }
        else if(this.state.page == 'e'){
            return this.setState({explore_page_tags_object: tag_group})
        }
        else{
            return this.setState({wallet_page_tags_object: tag_group})
        }
    }








    render_post_list_group(){
        var selected_page = this.state.page;
        if(selected_page == '?'){
            var selected_tag = this.state.work_page_tags_object['i'].active
            if(selected_tag == 'contracts' || selected_tag == 'e'){
                return(
                <div>{this.render_contracts_list_group()}</div>
                )
            }
            else if(selected_tag == 'proposals' ){
                return(
                <div>{this.render_proposal_list_group()}</div>
                )
            }
            else if(selected_tag == 'subscriptions' ){
                return(
                <div>{this.render_subscription_list_group()}</div>
                )
            }
        }
        else if(selected_page == 'e'){
            var selected_tag = this.state.explore_page_tags_object['i'].active
            if(selected_tag == 'E5s' || selected_tag == 'e'){
                return(
                <div>{this.render_E5s_list_group()}</div>
                )
            }
            else if(selected_tag == 'posts' ){
                return(
                <div>{this.render_posts_list_group()}</div>
                )
            }
            else if(selected_tag == 'channels' ){
                return(
                <div>{this.render_channels_list_group()}</div>
                )
            }
        }
        else if(selected_page == 'w'){
            var selected_tag = this.state.wallet_page_tags_object['i'].active
            var selected_item = this.state.wallet_page_tags_object['e'][2][0];
            var selected_option_name = this.state.wallet_page_tags_object['e'][1][selected_item];
            if(selected_option_name == 'ethers ⚗️' || selected_option_name == 'e'){
                return(
                <div>{this.render_ethers_list_group()}</div>
                )
            }
            else if(selected_option_name == 'ends ☝️' ){
                return(
                <div>{this.render_ends_list_group()}</div>
                )
            }
            else if(selected_option_name == 'spends 🫰' ){
                return(
                <div>{this.render_spends_list_group()}</div>
                )
            }
        }

    }

    
    render_contracts_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_contract_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_contract_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }



    render_proposal_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_proposal_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_proposal_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }


    render_subscription_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_subscription_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_subscription_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }



    render_E5s_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_E5s_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_E5s_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }



    render_posts_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_posts_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_posts_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }



    render_channels_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_channels_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_channels_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }



    render_ethers_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_ethers_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_ethers_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }




    render_ends_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_ends_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_ends_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }



    render_spends_list_group(){
        var middle = this.props.height-123;
        var size = this.props.size;
        if(size == 'l'){
            middle = this.props.height-80;
        }
        var items = ['0','1','2','3'];
        return ( 
            <div style={{overflow: 'auto', maxHeight: middle}}>
                <ul style={{ 'padding': '0px 0px 0px 0px'}}>
                    {items.map((item, index) => (
                        <li style={{'padding': '5px'}}>
                            {this.render_spends_object()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render_spends_object(){
        return(
                <div style={{height:180, width:'100%', 'background-color': 'rgb(225, 225, 225,.9)', 'border-radius': '15px','padding':'10px 0px 0px 10px', 'max-width':'420px','display': 'flex', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin':'10px 20px 0px 0px'}}>
                        <img src={Letter} style={{height:70 ,width:'auto'}} />
                        <p style={{'display': 'flex', 'align-items':'center','justify-content':'center', 'padding':'5px 0px 0px 7px', 'color': 'gray'}}></p>
                    </div>
                    
                </div>
            );
    }





    render_post_detail_object(){

    }

    

}




export default home_page;