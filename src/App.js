import React, { Component } from 'react';
import AlertIcon from './assets/alert_icon.png';

/* blockchain stuff */
import { mnemonicToSeedSync } from 'bip39';
import { Buffer } from 'buffer';
import { bigInt } from 'big-integer';


/* shared component stuff */
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'; 
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SwipeableViews from 'react-swipeable-views';

/* pages stuff */
import Syncronizing_page from './pages/synchronizing_page';
import Home_page from './pages/home_page';
import SendReceiveEtherPage from './pages/send_receive_ether_page'
import StackPage from './pages/stack_page'
import WikiPage from './pages/wiki_page'

import NewJobPage from './pages/create_action_pages/new_job_page'
import NewTokenPage from './pages/create_action_pages/new_token_page'
import NewSubscriptionPage from './pages/create_action_pages/new_subscription_page'
import NewContractPage from './pages/create_action_pages/new_contract_page'
import NewPostPage from './pages/create_action_pages/new_post_page'
import NewChannelPage from './pages/create_action_pages/new_channel_page'
import NewStorefrontPage from './pages/create_action_pages/new_storefront_page'
import NewStorefrontItemPage from './pages/create_action_pages/new_storefront_item_page';
import NewProposalPage from './pages/create_action_pages/new_proposal_page';
import NewMailPage from './pages/create_action_pages/new_mail_page';

import EnterContractPage from './pages/contract_action_pages/enter_contract_page';
import ExtendContractPage from './pages/contract_action_pages/extend_contract_page';
import ExitContractPage from './pages/contract_action_pages/exit_contract_page';
import ModifyContractPage from './pages/contract_action_pages/modify_contract_page';
import ForceExitPage from './pages/contract_action_pages/force_exit_account_page';

import NewMintActionPage from './pages/token_action_pages/mint_dump_token_page';
import NewTransferActionPage from './pages/token_action_pages/transfer_token_page';
import ModifyTokenPage from './pages/token_action_pages/modify_token_page';
import ExchangeTransferPage from './pages/token_action_pages/exchanage_transfer_page';
import FreezeUnfreezePage from './pages/token_action_pages/freeze_unfreeze_page';
import AuthMintPage from './pages/token_action_pages/authmint_page';

import VoteProposalPage from './pages/proposal_action_pages/vote_proposal_page';
import SubmitProposalPage from './pages/proposal_action_pages/submit_proposal_page';
import ArchiveProposalPage from './pages/proposal_action_pages/archive_proposals_page';

import PaySubscriptionPage from './pages/subscription_action_pages/pay_subscription_page';
import CancelSubscriptionPage from './pages/subscription_action_pages/cancel_subscription_page';
import CollectSubscriptionPage from './pages/subscription_action_pages/collect_subscription_page';
import ModifySubscriptionPage from './pages/subscription_action_pages/modify_subscription_page';

import ModeratorPage from './pages/moderator_page';
import RespondToJobPage from './pages/respond_to_job_page';
import ViewApplicationContractPage from './pages/view_application_contract_page';
import ViewTransactionPage from './pages/view_transaction_page'
import ViewTransactionLogPage from './pages/view_transaction_log'

import { HttpJsonRpcConnector, MnemonicWalletProvider} from 'filecoin.js';
import { LotusClient } from 'filecoin.js'
import { create } from 'ipfs-http-client'
import { Filecoin, FilecoinClient } from 'filecoin.js';
// import { WalletKey } from '@zondax/izari-filecoin'

const Web3 = require('web3');
const ethers = require("ethers");
// const { Wallet } = require('ethers');
const privateKeyToPublicKey = require('ethereum-private-key-to-public-key')
const ecies = require('ecies-geth');
var textEncoding = require('text-encoding'); 
var CryptoJS = require("crypto-js"); 

var TextDecoder = textEncoding.TextDecoder;

window.Buffer = window.Buffer || Buffer;


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

function bgN(number, power) {
  return bigInt((number+"e"+power)).toString();
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

async function balance(addr, client){
  
}

class App extends Component {

  state = { 
    page:'?',/* the page thats being shown, ?{jobs}, e{explore}, w{wallet} */
    syncronizing_page_bottomsheet:true,/* set to true if the syncronizing page bottomsheet is visible */
    should_keep_synchronizing_bottomsheet_open: false,/* set to true if the syncronizing page bottomsheet is supposed to remain visible */
    send_receive_bottomsheet: false, stack_bottomsheet: false, wiki_bottomsheet: false, new_object_bottomsheet: false, view_image_bottomsheet:false, new_store_item_bottomsheet:false, mint_token_bottomsheet:false, transfer_token_bottomsheet:false, enter_contract_bottomsheet: false, extend_contract_bottomsheet: false, exit_contract_bottomsheet:false, new_proposal_bottomsheet:false, vote_proposal_bottomsheet: false, submit_proposal_bottomsheet:false, pay_subscription_bottomsheet:false, cancel_subscription_bottomsheet: false,collect_subscription_bottomsheet: false, modify_subscription_bottomsheet:false, modify_contract_bottomsheet:false, modify_token_bottomsheet:false,exchange_transfer_bottomsheet:false, force_exit_bottomsheet:false, archive_proposal_bottomsheet:false, freeze_unfreeze_bottomsheet:false, authmint_bottomsheet:false, moderator_bottomsheet:false, respond_to_job_bottomsheet:false, view_application_contract_bottomsheet:false, view_transaction_bottomsheet:false, view_transaction_log_bottomsheet:false,

    syncronizing_progress:0,/* progress of the syncronize loading screen */
    theme: this.get_theme_data('light'),
    details_orientation: 'right',
    new_object_target: '0',
    created_object_array:[],
    account_balance:0, stack_items:[],
    created_subscriptions:[], all_subscriptions:[], 
    created_contracts:[], all_contracts:[], 
    created_tokens:[], all_tokens:[],
    created_jobs:[], 
    mint_dump_actions:[{},],

    web3:'http://127.0.0.1:8545/', e5_address:'0x19cEcCd6942ad38562Ee10bAfd44776ceB67e923',
    sync_steps:27,

    token_directory:{}, object_messages:{}, job_responses:{}, my_applications:[], my_contract_applications:{}, hidden:[]
  };


  constructor(props) {
    super(props);
    this.new_contract_page = React.createRef();
    this.new_token_page = React.createRef();
    this.new_subscription_page = React.createRef();
    this.new_post_page = React.createRef();
    this.new_channel_page = React.createRef();
    this.new_job_page = React.createRef();
    this.new_storefront_page = React.createRef();
    this.new_storefront_item_page = React.createRef();
    this.new_mint_dump_token_page = React.createRef();
    this.new_transfer_token_page = React.createRef();
    this.enter_contract_page = React.createRef();
    this.extend_contract_page = React.createRef();
    this.exit_contract_page = React.createRef();
    this.new_proposal_page = React.createRef();
    this.vote_proposal_page = React.createRef();
    this.submit_proposal_page = React.createRef();
    this.pay_subscription_page = React.createRef();
    this.cancel_subscription_page = React.createRef();
    this.collect_subscription_page = React.createRef();
    this.modify_subscription_page = React.createRef();
    this.modify_contract_page = React.createRef();
    this.modify_token_page = React.createRef();
    this.exchange_transfer_page = React.createRef();
    this.force_exit_page = React.createRef();
    this.archive_proposal_page = React.createRef();
    this.freeze_unfreeze_page = React.createRef();
    this.authmint_page = React.createRef();
    this.moderator_page = React.createRef();
    this.new_mail_page = React.createRef();
    this.respond_to_job_page = React.createRef();
    this.view_application_contract_page = React.createRef();
    this.view_transaction_page = React.createRef();
    this.view_transaction_log_page = React.createRef();
  }

  componentDidMount() {
    console.log("mounted");
    this.load_e5_data();
     

    /* listens for when the window is resized */
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    
  }

  /* called when the component is unmounted or closed */
  componentWillUnmount() {
    console.log("unmounted");
    window.removeEventListener("resize", this.resize.bind(this));
  }

  /* called when screensize is changed */
  resize() {
    /* set the width and height in the state */
    var post_object_w = 300;
    var detail_object_w = 400;
    
    this.setState({height: window.screen.availHeight, width: window.screen.availWidth});
  }

  /* gets the screensize in three categories, small medium and large */
  getScreenSize() {
      var width = this.state.width;
      var height = this.state.height;

      if(width<350 || height <550){
          return 'e';
      }

      else if(width == 1366 && height == 1024){
          return 'e';//l
      }

      else if(width > 1250){
          return 'e';
      }

      if(width > 1020){
          return 'e';//l
      }
      else if(width > 730){
          return 'e'; //m
      }else{
          if(width < 280){
              return 'e';
          }
          return 's';
          
      }

  }

  get_theme_data(theme){
    //this.props.theme['']
    if(theme == 'light'){
      return{
        'bar_shadow':'#CECDCD','bar_color':'#444444', 'bar_background_color':'#919191','nav_bar_color':'#444444',
        
        'homepage_background_color':'#F1F1F1','syncronizing_page_background_color':'#F1F1F1','send_receive_ether_background_color':'#F1F1F1','send_receive_ether_overlay_background':'#474747','send_receive_ether_overlay_shadow':'#CECDCD',
        
        'primary_text_color':'#393e46','secondary_text_color':'grey',
        
        'navbar_button_selected_color':'#545454','primary_navbar_text_color':'white','secondary_navbar_text_color':'#e6e6e6','card_background_color':'rgb(225, 225, 225,.9)','card_shadow_color':'#DCDCDC',
        
        'view_group_card_item_background':'rgb(217, 217, 217,.6)','tag_background_color':'#787878','indexed_tag_background':'#5e5e5e','tag_shadow':'#868686',
        
        'chart_color':'#FCFCFC','chart_background_color':'#D5D5D5',
  
        'number_picker_label_color':'#3C3C3C','number_picker_label_shadow':'#868686',
        'number_picker_power_color':'white','number_picker_power_shadow_color':'#CECDCD','number_picker_label_text_color':'#878787',
        
        'slider_color':'white', 'toast_background_color':'white', 'calendar_color':'light'
      }
    }
    else if(theme == 'dark'){
      return{
        'bar_shadow':'#919191','bar_color':'white', 'bar_background_color':'#919191','nav_bar_color':'#444444',
        
        'homepage_background_color':'#292929','syncronizing_page_background_color':'#292929','send_receive_ether_background_color':'#292929','send_receive_ether_overlay_background':'#424242','send_receive_ether_overlay_shadow':'#424242',

        'primary_text_color':'white', 'secondary_text_color':'#e6e6e6',
        
        'navbar_button_selected_color':'#545454','card_background_color':'rgb(51, 51, 51,.9)', 'primary_navbar_text_color':'white','secondary_navbar_text_color':'#e6e6e6','card_shadow_color':'#424242',

        'view_group_card_item_background':'#2e2e2e','tag_background_color':'#444444', 'indexed_tag_background':'#404040', 'tag_shadow':'#424242',

        'chart_color':'#333333','chart_background_color':'#232323',

        'number_picker_label_color':'#3C3C3C','number_picker_label_shadow':'#262626',
        'number_picker_power_color':'white','number_picker_power_shadow_color':'#CECDCD','number_picker_label_text_color':'#878787', 
        
        'slider_color':'white','toast_background_color':'#333333', 'calendar_color':'dark'
      }
    }
  }




  render(){
    return (
      <div className="App">
        {this.render_page()}
        {this.render_synchronizing_bottomsheet()}
        {this.render_send_receive_ether_bottomsheet()}
        {this.render_stack_bottomsheet()}
        {this.render_view_transaction_bottomsheet()}
        {this.render_wiki_bottomsheet()}
        {this.render_new_object_bottomsheet()}
        {this.render_view_image_bottomsheet()}
        {this.render_create_store_item_bottomsheet()}
        {this.render_mint_token_bottomsheet()}
        {this.render_transfer_token_bottomsheet()}
        {this.render_enter_contract_bottomsheet()}
        {this.render_extend_contract_bottomsheet()}
        {this.render_exit_contract_bottomsheet()}
        {this.render_new_proposal_bottomsheet()}
        {this.render_vote_proposal_bottomsheet()}
        {this.render_submit_proposal_bottomsheet()}
        {this.render_pay_subscription_bottomsheet()}
        {this.render_cancel_subscription_bottomsheet()}
        {this.render_collect_subscription_bottomsheet()}
        {this.render_modify_subscription_bottomsheet()}
        {this.render_modify_contract_bottomsheet()}
        {this.render_modify_token_bottomsheet()}
        {this.render_exchange_transfer_bottomsheet()}
        {this.render_force_exit_bottomsheet()}
        {this.render_archive_proposal_bottomsheet()}
        {this.render_freeze_unfreeze_bottomsheet()}
        {this.render_authmint_bottomsheet()}
        {this.render_moderator_bottomsheet()}
        {this.render_respond_to_job_bottomsheet()}
        {this.render_view_application_contract_bottomsheet()}
        {this.render_view_transaction_log_bottomsheet()}
        <ToastContainer limit={3} containerId="id"/>
      </div>
    );
  }

  render_page(){
    return(
      <Home_page 
      screensize={this.getScreenSize()} 
      width={this.state.width} height={this.state.height} app_state={this.state} notify={this.prompt_top_notification.bind(this)}open_send_receive_ether_bottomsheet={this.open_send_receive_ether_bottomsheet.bind(this)} open_stack_bottomsheet={this.open_stack_bottomsheet.bind(this)} theme={this.state.theme} details_orientation={this.state.details_orientation} 
      open_wiki_bottomsheet={this.open_wiki_bottomsheet.bind(this)} 
      open_new_object={this.open_new_object.bind(this)} 
      when_view_image_clicked={this.when_view_image_clicked.bind(this)} when_edit_job_tapped={this.when_edit_created_job_tapped.bind(this)} fetch_objects_data={this.fetch_objects_data.bind(this)}
      
      show_mint_token_bottomsheet={this.show_mint_token_bottomsheet.bind(this)}
      show_transfer_bottomsheet={this.show_transfer_bottomsheet.bind(this)}
      show_enter_contract_bottomsheet={this.show_enter_contract_bottomsheet.bind(this)}
      show_extend_contract_bottomsheet={this.show_extend_contract_bottomsheet.bind(this)}
      show_exit_contract_bottomsheet={this.show_exit_contract_bottomsheet.bind(this)}
      show_new_proposal_bottomsheet={this.show_new_proposal_bottomsheet.bind(this)}
      show_vote_proposal_bottomsheet={this.show_vote_proposal_bottomsheet.bind(this)}
      show_submit_proposal_bottomsheet={this.show_submit_proposal_bottomsheet.bind(this)}
      show_pay_subscription_bottomsheet={this.show_pay_subscription_bottomsheet.bind(this)}
      show_cancel_subscription_bottomsheet={this.show_cancel_subscription_bottomsheet.bind(this)}
      show_collect_subscription_bottomsheet={this.show_collect_subscription_bottomsheet.bind(this)}
      show_modify_subscription_bottomsheet={this.show_modify_subscription_bottomsheet.bind(this)}
      show_modify_contract_bottomsheet={this.show_modify_contract_bottomsheet.bind(this)}
      show_modify_token_bottomsheet={this.show_modify_token_bottomsheet.bind(this)}
      show_exchange_transfer_bottomsheet={this.show_exchange_transfer_bottomsheet.bind(this)}
      show_force_exit_bottomsheet={this.show_force_exit_bottomsheet.bind(this)}
      show_archive_proposal_bottomsheet={this.show_archive_proposal_bottomsheet.bind(this)}
      show_freeze_unfreeze_bottomsheet={this.show_freeze_unfreeze_bottomsheet.bind(this)}
      show_authmint_bottomsheet={this.show_authmint_bottomsheet.bind(this)}
      show_moderator_bottomsheet={this.show_moderator_bottomsheet.bind(this)}
      show_images={this.show_images.bind(this)} show_respond_to_job_bottomsheet={this.show_respond_to_job_bottomsheet.bind(this)}

      add_mail_to_stack_object={this.add_mail_to_stack_object.bind(this)} add_channel_message_to_stack_object={this.add_channel_message_to_stack_object.bind(this)} get_objects_messages={this.get_objects_messages.bind(this)} add_post_reply_to_stack={this.add_post_reply_to_stack.bind(this)} get_job_objects_responses={this.get_job_objects_responses.bind(this)} show_view_application_contract_bottomsheet={this.show_view_application_contract_bottomsheet.bind(this)} add_job_message_to_stack_object={this.add_job_message_to_stack_object.bind(this)} add_proposal_message_to_stack_object={this.add_proposal_message_to_stack_object.bind(this)}
      />
    )
  }

  add_mail_to_stack_object(message){
    var stack = this.state.stack_items.slice()
    var pos = -1
    for(var i=0; i<stack.length; i++){
      if(stack[i].type == 'mail-messages'){
        pos = i
        break;
      }
    }
    if(pos == -1){
      var tx = {selected: 0, id: makeid(8), type:'mail-messages', entered_indexing_tags:['send', 'mail'], messages_to_deliver:[]}
      tx.messages_to_deliver.push(message)
      stack.push(tx)
    }else{
      stack[pos].messages_to_deliver.push(message)
    }
    this.setState({stack_items: stack})
  }

  add_channel_message_to_stack_object(message){
    var stack = this.state.stack_items.slice()
    var pos = -1
    for(var i=0; i<stack.length; i++){
      if(stack[i].type == 'channel-messages'){
        pos = i
        break;
      }
    }
    if(pos == -1){
      var tx = {selected: 0, id: makeid(8), type:'channel-messages', entered_indexing_tags:['send', 'channel','messages'], messages_to_deliver:[]}
      tx.messages_to_deliver.push(message)
      stack.push(tx)
    }else{
      stack[pos].messages_to_deliver.push(message)
    }
    this.setState({stack_items: stack})
  }

  add_post_reply_to_stack(message){
    var stack = this.state.stack_items.slice()
    var pos = -1
    for(var i=0; i<stack.length; i++){
      if(stack[i].type == 'post-messages'){
        pos = i
        break;
      }
    }
    if(pos == -1){
      var tx = {selected: 0, id: makeid(8), type:'post-messages', entered_indexing_tags:['send', 'post','comment'], messages_to_deliver:[]}
      tx.messages_to_deliver.push(message)
      stack.push(tx)
    }else{
      stack[pos].messages_to_deliver.push(message)
    }
    this.setState({stack_items: stack})
  }

  add_job_message_to_stack_object(message){
    var stack = this.state.stack_items.slice()
    var pos = -1
    for(var i=0; i<stack.length; i++){
      if(stack[i].type == 'job-messages'){
        pos = i
        break;
      }
    }
    if(pos == -1){
      var tx = {selected: 0, id: makeid(8), type:'job-messages', entered_indexing_tags:['send', 'job','comment'], messages_to_deliver:[]}
      tx.messages_to_deliver.push(message)
      stack.push(tx)
    }else{
      stack[pos].messages_to_deliver.push(message)
    }
    this.setState({stack_items: stack})
  }

  add_proposal_message_to_stack_object(message){
    var stack = this.state.stack_items.slice()
    var pos = -1
    for(var i=0; i<stack.length; i++){
      if(stack[i].type == 'proposal-messages'){
        pos = i
        break;
      }
    }
    if(pos == -1){
      var tx = {selected: 0, id: makeid(8), type:'proposal-messages', entered_indexing_tags:['send', 'job','comment'], messages_to_deliver:[]}
      tx.messages_to_deliver.push(message)
      stack.push(tx)
    }else{
      stack[pos].messages_to_deliver.push(message)
    }
    this.setState({stack_items: stack})
  }





  render_synchronizing_bottomsheet(){
    var background_color = this.state.theme['syncronizing_page_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet overflowHeight={0} marginTop={50} onChange={this.open_syncronizing_page_bottomsheet.bind(this)} open={this.state.syncronizing_page_bottomsheet} onTransitionEnd={this.keep_syncronizing_page_open()}  style={{'z-index':'3'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': 'grey'}}>
          <div style={{ height: this.state.height, 'background-color': background_color, 'margin': '0px 0px 0px 0px', 'padding':'10px 10px 0px 10px', 'overflow-y':'auto'}}>
            <Syncronizing_page sync_progress={this.state.syncronizing_progress} theme={this.state.theme}/>
          </div>  
      </SwipeableBottomSheet>
    );
  }

  /* opens the bottomsheet for veiwing a post and its details when clicked */
  open_syncronizing_page_bottomsheet(){
      if(this.state != null){
        this.setState({syncronizing_page_bottomsheet: !this.state.syncronizing_page_bottomsheet});
      }
  };

  keep_syncronizing_page_open(){
    if(!this.state.syncronizing_page_bottomsheet && this.state.should_keep_synchronizing_bottomsheet_open){
        this.open_syncronizing_page_bottomsheet();
    }
  };


  render_send_receive_ether_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var overlay_background = this.state.theme['send_receive_ether_overlay_background'];
    var overlay_shadow_color = this.state.theme['send_receive_ether_overlay_shadow'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_send_receive_ether_bottomsheet.bind(this)} open={this.state.send_receive_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': overlay_background,'box-shadow': '0px 0px 0px 0px '+overlay_shadow_color}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': overlay_shadow_color, 'border-radius': '5px 5px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 0px 0px '+overlay_shadow_color,'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>
              
              <SendReceiveEtherPage app_state={this.state} size={size} notify={this.prompt_top_notification.bind(this)} send_ether_to_target={this.send_ether_to_target.bind(this)} transaction_history={this.state.account_transaction_history} theme={this.state.theme} ether_balance={this.state.account_balance}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_send_receive_ether_bottomsheet(){
    if(this.state != null){
        this.setState({send_receive_bottomsheet: !this.state.send_receive_bottomsheet});
      }
  }


  render_stack_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_stack_bottomsheet.bind(this)} open={this.state.stack_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>
              
              <StackPage app_state={this.state} size={size} theme={this.state.theme} when_device_theme_changed={this.when_device_theme_changed.bind(this)} when_details_orientation_changed={this.when_details_orientation_changed.bind(this)} notify={this.prompt_top_notification.bind(this)} when_wallet_data_updated={this.when_wallet_data_updated.bind(this)} height={this.state.height} run_transaction_with_e={this.run_transaction_with_e.bind(this)} store_data_in_infura={this.store_data_in_infura.bind(this)} get_accounts_public_key={this.get_accounts_public_key.bind(this)} encrypt_data_object={this.encrypt_data_object.bind(this)} encrypt_key_with_accounts_public_key_hash={this.encrypt_key_with_accounts_public_key_hash.bind(this)} get_account_public_key={this.get_account_public_key.bind(this)} get_account_raw_public_key={this.get_account_raw_public_key.bind(this)} view_transaction={this.view_transaction.bind(this)} show_hide_stack_item={this.show_hide_stack_item.bind(this)} show_view_transaction_log_bottomsheet={this.show_view_transaction_log_bottomsheet.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }


  open_stack_bottomsheet(){
    if(this.state != null){
        this.setState({stack_bottomsheet: !this.state.stack_bottomsheet});
      }
  }


  when_device_theme_changed(theme){
    this.setState({theme: this.get_theme_data(theme)})
  }

  when_details_orientation_changed(orientation){
    this.setState({details_orientation: orientation})
  }

  run_transaction_with_e = async (strs, ints, adds, run_gas_limit, wei) => {
    const web3 = new Web3(this.state.web3);
    const contractArtifact = require('./contract_abis/E5.json');
    const contractAddress = this.state.e5_address
    const contractInstance = new web3.eth.Contract(contractArtifact.abi, contractAddress); 
    const me = this

    var v5/* t_limits */ = [1000000000000, 1000000000000];
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice: "+gasPrice);
    const gasLimit = run_gas_limit;

    var encoded = contractInstance.methods.e(v5/* t_limits */, adds, ints, strs).encodeABI()

    var tx = {
        gas: gasLimit,
        value: wei,
        to: contractAddress,
        data: encoded
    }

    
    console.log('-------------------')
    web3.eth.accounts.signTransaction(tx, me.state.account.privateKey).then(signed => {
      console.log('-------------------')
        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', (receipt) => {
          console.log('e Transaction receipt:', receipt);
          me.setState({stack_items: []})
          me.get_accounts_data(me.state.account)
          this.prompt_top_notification('run complete!', 600)
        }) .on('error', (error) => {
          console.error('Transaction error:', error);
          this.prompt_top_notification('run failed. Check your stacks transactions and try again', 1500)
        });
    })

    // this.prompt_top_notification('running your transactions...', 600)
    // web3.eth.accounts.wallet.add(me.state.account.privateKey);
    // contractInstance.methods.e(v5/* t_limits */, adds, ints, strs)
    //     .send({
    //       from: me.state.account.address, 
    //       value: wei,
    //       gasPrice, 
    //       gasLimit 
    //     })
    //     .on('transactionHash', (hash) => {
    //       console.log('e Transaction hash:', hash);
    //     })
    //     .on('receipt', (receipt) => {
    //       console.log('e Transaction receipt:', receipt);
    //       me.setState({stack_items: []})
    //       me.get_accounts_data(me.state.account)
    //       this.prompt_top_notification('run complete!', 600)
    //     }).on('error', (error) => {
    //       console.error('Transaction error:', error);
    //       this.prompt_top_notification('run failed. Check your stacks transactions and try again', 1500)
    //     });


    // this.prompt_top_notification('running your transactions...', 600)
    // const provider = new ethers.providers.JsonRpcProvider(this.state.web3);
    // const wallet = new ethers.Wallet(me.state.account.privateKey, provider);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(contractAddress, contractArtifact.abi, signer);
    // const tx = await contract.connect(wallet).e(v5/* t_limits */, adds, ints, strs, { gasLimit: gasLimit, value: wei })
    // const receipt = await tx.wait();

    // if (receipt.status === 1) {
    //   console.log('Transaction successful. Transaction hash:', receipt.transactionHash);
    //   me.setState({stack_items: []})
    //   me.get_accounts_data(me.state.account)
    //   this.prompt_top_notification('run complete!', 600)
    // } else {
    //   console.log('Transaction failed. Transaction hash:', receipt.transactionHash);
    //   this.prompt_top_notification('run failed. Check your stacks transactions and try again', 1500)
    // }
  }

  view_transaction(tx, index){
    this.show_view_transaction_bottomsheet(tx, index)
  }

  show_hide_stack_item(item){
        var clone_array = this.state.hidden.slice()
        const index = clone_array.indexOf(item);
        if (index > -1) { // only splice array when item is found
            clone_array.splice(index, 1); // 2nd parameter means remove one item only
        }else{
            clone_array.push(item)
        }
        this.setState({hidden: clone_array})
    }




  render_wiki_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_wiki_bottomsheet.bind(this)} open={this.state.wiki_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>
              
              <WikiPage app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} />
          </div>
      </SwipeableBottomSheet>
    )
  }


  open_wiki_bottomsheet(){
    if(this.state != null){
        this.setState({wiki_bottomsheet: !this.state.wiki_bottomsheet});
      }
  }




  render_new_object_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_new_object_bottomsheet.bind(this)} open={this.state.new_object_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            {this.render_create_object_ui()}
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_new_object_bottomsheet(){
    if(this.state != null){
      this.setState({new_object_bottomsheet: !this.state.new_object_bottomsheet});
    }
  }

  open_new_object(target){
    this.setState({new_object_target: target});
    this.open_new_object_bottomsheet()
  }

  render_create_object_ui(){
    var target = this.state.new_object_target;
    var size = this.getScreenSize();
    if(target == '0'){
      return(
        <div>
          <NewJobPage ref={this.new_job_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)}/>
        </div>
      )
    }
    else if(target == '8'){
      return(
        <div>
          <NewTokenPage ref={this.new_token_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)}/>
        </div>
      )
    }
    else if(target == '3'){
      return(
        <NewSubscriptionPage ref={this.new_subscription_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)}/>
      )
    }
    else if(target == '1'){
      return(
        <NewContractPage ref={this.new_contract_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)}/>
      )
    }
    else if(target == '6'){
      return(
        <NewPostPage ref={this.new_post_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)}/>
      )
    }
    else if(target == '7'){
      return(
        <NewChannelPage ref={this.new_channel_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)} />
      )
    }
    else if(target == '4'){
      return(
        <NewStorefrontPage ref={this.new_storefront_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} open_new_store_item_bottomsheet={this.open_new_store_item_bottomsheet.bind(this)} edit_storefront_item={this.edit_storefront_item.bind(this)} when_add_new_object_to_stack={this.when_add_new_object_to_stack.bind(this)}/>
      )
    }
    else if(target == '5'){
      return(
        <NewMailPage ref={this.new_mail_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_mail_to_stack={this.when_add_new_mail_to_stack.bind(this)}/>
      );
    }
    
  }

  when_edit_created_job_tapped(obj){
    this.new_job_page.current.set_fileds_for_edit_action(obj)
    this.new_job_page.current.set_action('edit')
    this.open_new_object_bottomsheet()
  }

  edit_storefront_item(item){
    this.new_storefront_item_page.current.set_fileds_for_edit_action(item)
    this.open_new_store_item_bottomsheet()
  }


  when_add_new_mail_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()
    var edit_id = -1
      for(var i=0; i<stack_clone.length; i++){
        if(stack_clone[i].id == state_obj.id){
          edit_id = i
        }
      }
      if(edit_id != -1){
        stack_clone[edit_id] = state_obj
      }else{
        stack_clone.push(state_obj)
      }
    this.setState({stack_items: stack_clone})
  }

  render_create_store_item_bottomsheet(){
        var background_color = this.state.theme['send_receive_ether_background_color'];
        var size = this.getScreenSize();
        return(
            <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_new_store_item_bottomsheet.bind(this)} open={this.state.new_store_item_bottomsheet} style={{'z-index':'7'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
                <div style={{ height: this.state.height-70, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>
                    <NewStorefrontItemPage ref={this.new_storefront_item_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_data_to_new_store_item={this.add_data_to_new_store_item.bind(this)}/>
                </div>
            </SwipeableBottomSheet>
        )
  }


    open_new_store_item_bottomsheet(){
      if(this.state != null){
        this.setState({new_store_item_bottomsheet: !this.state.new_store_item_bottomsheet});
      }
    }

    add_data_to_new_store_item(data){
      this.new_storefront_page.current.add_data_to_new_store_item(data)
      this.open_new_store_item_bottomsheet()
    }

    when_add_new_object_to_stack(state_obj){
      var stack_clone = this.state.stack_items.slice()
      var edit_id = -1
      for(var i=0; i<stack_clone.length; i++){
        if(stack_clone[i].id == state_obj.id){
          edit_id = i
        }
      }
      if(edit_id != -1){
        stack_clone[edit_id] = state_obj
      }else{
        stack_clone.push(state_obj)
      }
      this.setState({stack_items: stack_clone})
    }












  render_mint_token_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_mint_token_bottomsheet.bind(this)} open={this.state.mint_token_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <NewMintActionPage ref={this.new_mint_dump_token_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_buy_sell_transaction_to_stack={this.add_buy_sell_transaction.bind(this)}get_balance_in_exchange={this.get_balance_in_exchange.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }


  open_mint_token_bottomsheet(){
    if(this.state != null){
        this.setState({mint_token_bottomsheet: !this.state.mint_token_bottomsheet});
      }
  }

  show_mint_token_bottomsheet(mint_burn_token_item){
    if(this.new_mint_dump_token_page.current != null){
      this.new_mint_dump_token_page.current.set_token(mint_burn_token_item)
    }

    this.open_mint_token_bottomsheet()
  }


  add_buy_sell_transaction(state_obj){
    var stack_clone = this.state.stack_items.slice()
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }







  render_transfer_token_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_transfer_token_bottomsheet.bind(this)} open={this.state.transfer_token_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <NewTransferActionPage ref={this.new_transfer_token_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_transfer_transactions_to_stack={this.add_transfer_transactions_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }


  open_transfer_token_bottomsheet(){
    if(this.state != null){
        this.setState({transfer_token_bottomsheet: !this.state.transfer_token_bottomsheet});
      }
  }

  show_transfer_bottomsheet(token_item){
    if(this.new_transfer_token_page.current != null){
      this.new_transfer_token_page.current.set_token(token_item)
    }

    this.open_transfer_token_bottomsheet()
  }

  add_transfer_transactions_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }







  render_enter_contract_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_enter_contract_bottomsheet.bind(this)} open={this.state.enter_contract_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <EnterContractPage ref={this.enter_contract_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} enter_contract={this.enter_contract.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_enter_contract_bottomsheet(){
    if(this.state != null){
        this.setState({enter_contract_bottomsheet: !this.state.enter_contract_bottomsheet});
      }
  }

  show_enter_contract_bottomsheet(contract_item){
    if(this.enter_contract_page.current != null){
      this.enter_contract_page.current.set_contract(contract_item)
    }

    this.open_enter_contract_bottomsheet()
  }

  enter_contract(state_obj){
    var stack_clone = this.state.stack_items.slice()
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }








  render_extend_contract_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_extend_contract_bottomsheet.bind(this)} open={this.state.extend_contract_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ExtendContractPage ref={this.extend_contract_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} extend_contract={this.extend_contract.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_extend_contract_bottomsheet(){
    if(this.state != null){
        this.setState({extend_contract_bottomsheet: !this.state.extend_contract_bottomsheet});
      }
  }

  show_extend_contract_bottomsheet(contract_item){
    if(this.extend_contract_page.current != null){
      this.extend_contract_page.current.set_contract(contract_item)
    }

    this.open_extend_contract_bottomsheet()
  }

  extend_contract(state_obj){
    var stack_clone = this.state.stack_items.slice()
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }




  render_exit_contract_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_exit_contract_bottomsheet.bind(this)} open={this.state.exit_contract_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ExitContractPage ref={this.exit_contract_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} exit_contract={this.exit_contract.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_exit_contract_bottomsheet(){
    if(this.state != null){
        this.setState({exit_contract_bottomsheet: !this.state.exit_contract_bottomsheet});
      }
  }

  show_exit_contract_bottomsheet(contract_item){
    if(this.exit_contract_page.current != null){
      this.exit_contract_page.current.set_contract(contract_item)
    }

    this.open_exit_contract_bottomsheet()
  }

  exit_contract(state){
    var stack_clone = this.state.stack_items.slice()
    stack_clone.push(state)
    this.setState({stack_items: stack_clone})
  }






  render_new_proposal_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_new_proposal_bottomsheet.bind(this)} open={this.state.new_proposal_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <NewProposalPage ref={this.new_proposal_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} when_add_new_proposal_to_stack={this.when_add_new_proposal_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_new_proposal_bottomsheet(){
    if(this.state != null){
        this.setState({new_proposal_bottomsheet: !this.state.new_proposal_bottomsheet});
      }
  }

  show_new_proposal_bottomsheet(contract_item){
    if(this.new_proposal_page.current != null){
      this.new_proposal_page.current.reset_state()
      this.new_proposal_page.current.set_contract(contract_item)
    }

    this.open_new_proposal_bottomsheet()
  }

  when_add_new_proposal_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }







  render_vote_proposal_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_vote_proposal_bottomsheet.bind(this)} open={this.state.vote_proposal_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <VoteProposalPage ref={this.vote_proposal_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_vote_proposal_action_to_stack={this.add_vote_proposal_action_to_stack.bind(this)} />
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_vote_proposal_bottomsheet(){
    if(this.state != null){
        this.setState({vote_proposal_bottomsheet: !this.state.vote_proposal_bottomsheet});
      }
  }


  show_vote_proposal_bottomsheet(proposal_item){
    if(this.vote_proposal_page.current != null){
      this.vote_proposal_page.current.set_proposal(proposal_item)
    }

    this.open_vote_proposal_bottomsheet()
  }


  add_vote_proposal_action_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }





  render_submit_proposal_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_submit_proposal_bottomsheet.bind(this)} open={this.state.submit_proposal_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <SubmitProposalPage ref={this.submit_proposal_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_submit_proposal_action_to_stack={this.add_submit_proposal_action_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_submit_proposal_bottomsheet(){
    if(this.state != null){
        this.setState({submit_proposal_bottomsheet: !this.state.submit_proposal_bottomsheet});
      }
  }

  show_submit_proposal_bottomsheet(proposal_item){
    if(this.submit_proposal_page.current != null){
      this.submit_proposal_page.current.set_proposal(proposal_item)
    }

    this.open_submit_proposal_bottomsheet()
  }


  add_submit_proposal_action_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    stack_clone.push(state_obj)
    this.setState({stack_items: stack_clone})
  }














  render_pay_subscription_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_pay_subscription_bottomsheet.bind(this)} open={this.state.pay_subscription_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <PaySubscriptionPage ref={this.pay_subscription_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_pay_subscription_to_stack={this.add_pay_subscription_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_pay_subscription_bottomsheet(){
    if(this.state != null){
        this.setState({pay_subscription_bottomsheet: !this.state.pay_subscription_bottomsheet});
      }
  }

  show_pay_subscription_bottomsheet(subscription_item){
    if(this.pay_subscription_page.current != null){
      this.pay_subscription_page.current.set_subscription(subscription_item)
    }

    this.open_pay_subscription_bottomsheet()
  }

  add_pay_subscription_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }









  render_cancel_subscription_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_cancel_subscription_bottomsheet.bind(this)} open={this.state.cancel_subscription_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <CancelSubscriptionPage ref={this.cancel_subscription_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_cancel_subscription_to_stack={this.add_cancel_subscription_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_cancel_subscription_bottomsheet(){
    if(this.state != null){
        this.setState({cancel_subscription_bottomsheet: !this.state.cancel_subscription_bottomsheet});
      }
  }

  show_cancel_subscription_bottomsheet(subscription_item){
    if(this.cancel_subscription_page.current != null){
      this.cancel_subscription_page.current.set_subscription(subscription_item)
    }

    this.open_cancel_subscription_bottomsheet()
  }

  add_cancel_subscription_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }












  render_collect_subscription_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_collect_subscription_bottomsheet.bind(this)} open={this.state.collect_subscription_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <CollectSubscriptionPage ref={this.collect_subscription_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_collect_subscription_to_stack={this.add_collect_subscription_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_collect_subscription_bottomsheet(){
    if(this.state != null){
        this.setState({collect_subscription_bottomsheet: !this.state.collect_subscription_bottomsheet});
      }
  }

  show_collect_subscription_bottomsheet(subscription_item){
    if(this.collect_subscription_page.current != null){
      this.collect_subscription_page.current.set_subscription(subscription_item)
    }

    this.open_collect_subscription_bottomsheet()
  }

  add_collect_subscription_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }











  render_modify_subscription_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_modify_subscription_bottomsheet.bind(this)} open={this.state.modify_subscription_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ModifySubscriptionPage ref={this.modify_subscription_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_modify_subscription_to_stack={this.add_modify_subscription_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_modify_subscription_bottomsheet(){
    if(this.state != null){
        this.setState({modify_subscription_bottomsheet: !this.state.modify_subscription_bottomsheet});
      }
  }

  show_modify_subscription_bottomsheet(subscription_item){
    if(this.modify_subscription_page.current != null){
      this.modify_subscription_page.current.set_subscription(subscription_item)
    }

    this.open_modify_subscription_bottomsheet()
  }

  add_modify_subscription_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }










  render_modify_contract_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_modify_contract_bottomsheet.bind(this)} open={this.state.modify_contract_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ModifyContractPage ref={this.modify_contract_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_modify_contract_to_stack={this.add_modify_contract_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_modify_contract_bottomsheet(){
    if(this.state != null){
        this.setState({modify_contract_bottomsheet: !this.state.modify_contract_bottomsheet});
      }
  }

  show_modify_contract_bottomsheet(contract_item){
    if(this.modify_contract_page.current != null){
      this.modify_contract_page.current.set_contract(contract_item)
    }

    this.open_modify_contract_bottomsheet()
  }

  add_modify_contract_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }










  render_modify_token_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_modify_token_bottomsheet.bind(this)} open={this.state.modify_token_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ModifyTokenPage ref={this.modify_token_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_modify_token_to_stack={this.add_modify_token_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_modify_token_bottomsheet(){
    if(this.state != null){
        this.setState({modify_token_bottomsheet: !this.state.modify_token_bottomsheet});
      }
  }

  show_modify_token_bottomsheet(token_item){
    if(this.modify_token_page.current != null){
      this.modify_token_page.current.set_token(token_item)
    }

    this.open_modify_token_bottomsheet()
  }

  add_modify_token_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }









  render_exchange_transfer_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_exchange_transfer_bottomsheet.bind(this)} open={this.state.exchange_transfer_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ExchangeTransferPage ref={this.exchange_transfer_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_exchange_transfer_to_stack={this.add_exchange_transfer_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_exchange_transfer_bottomsheet(){
    if(this.state != null){
        this.setState({exchange_transfer_bottomsheet: !this.state.exchange_transfer_bottomsheet});
      }
  }

  show_exchange_transfer_bottomsheet(token_item){
    if(this.exchange_transfer_page.current != null){
      this.exchange_transfer_page.current.set_token(token_item)
    }

    this.open_exchange_transfer_bottomsheet()
  }

  add_exchange_transfer_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }






  render_force_exit_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_force_exit_bottomsheet.bind(this)} open={this.state.force_exit_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ForceExitPage ref={this.force_exit_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_force_exit_to_stack={this.add_force_exit_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_force_exit_bottomsheet(){
    if(this.state != null){
        this.setState({force_exit_bottomsheet: !this.state.force_exit_bottomsheet});
      }
  }

  show_force_exit_bottomsheet(contract_item){
    if(this.force_exit_page.current != null){
      this.force_exit_page.current.set_contract(contract_item)
    }

    this.open_force_exit_bottomsheet()
  }

  add_force_exit_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }










  render_archive_proposal_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_archive_proposal_bottomsheet.bind(this)} open={this.state.archive_proposal_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ArchiveProposalPage ref={this.archive_proposal_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_archive_proposal_action_to_stack={this.add_archive_proposal_action_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_archive_proposal_bottomsheet(){
    if(this.state != null){
        this.setState({archive_proposal_bottomsheet: !this.state.archive_proposal_bottomsheet});
      }
  }

  show_archive_proposal_bottomsheet(proposal_item){
    if(this.archive_proposal_page.current != null){
      this.archive_proposal_page.current.set_object(proposal_item)
    }

    this.open_archive_proposal_bottomsheet()
  }


  add_archive_proposal_action_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }







  render_freeze_unfreeze_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_freeze_unfreeze_bottomsheet.bind(this)} open={this.state.freeze_unfreeze_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <FreezeUnfreezePage ref={this.freeze_unfreeze_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_freeze_unfreeze_to_stack={this.add_freeze_unfreeze_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_freeze_unfreeze_bottomsheet(){
    if(this.state != null){
        this.setState({freeze_unfreeze_bottomsheet: !this.state.freeze_unfreeze_bottomsheet});
      }
  }

  show_freeze_unfreeze_bottomsheet(token_item){
    if(this.freeze_unfreeze_page.current != null){
      this.freeze_unfreeze_page.current.set_token(token_item)
    }

    this.open_freeze_unfreeze_bottomsheet()
  }

  add_freeze_unfreeze_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }










  render_authmint_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_authmint_bottomsheet.bind(this)} open={this.state.authmint_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <AuthMintPage ref={this.authmint_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_authmint_to_stack={this.add_authmint_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_authmint_bottomsheet(){
    if(this.state != null){
        this.setState({authmint_bottomsheet: !this.state.authmint_bottomsheet});
      }
  }

  show_authmint_bottomsheet(token_item){
    if(this.authmint_page.current != null){
      this.authmint_page.current.set_token(token_item)
    }

    this.open_authmint_bottomsheet()
  }

  add_authmint_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }





  render_moderator_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_moderator_bottomsheet.bind(this)} open={this.state.moderator_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ModeratorPage ref={this.moderator_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_moderator_to_stack={this.add_moderator_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_moderator_bottomsheet(){
    if(this.state != null){
        this.setState({moderator_bottomsheet: !this.state.moderator_bottomsheet});
      }
  }

  show_moderator_bottomsheet(item){
    if(this.moderator_page.current != null){
      this.moderator_page.current.set_object(item)
    }

    this.open_moderator_bottomsheet()
  }

  add_moderator_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})
  }








  render_respond_to_job_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_respond_to_job_bottomsheet.bind(this)} open={this.state.respond_to_job_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <RespondToJobPage ref={this.respond_to_job_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_respond_to_job_to_stack={this.add_respond_to_job_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_respond_to_job_bottomsheet(){
    if(this.state != null){
      this.setState({respond_to_job_bottomsheet: !this.state.respond_to_job_bottomsheet});
    }
  }

  show_respond_to_job_bottomsheet(item){
    if(this.respond_to_job_page.current != null){
      this.respond_to_job_page.current.set_object(item)
    }

    this.open_respond_to_job_bottomsheet()
  }

  add_respond_to_job_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    var edit_id = -1
    for(var i=0; i<stack_clone.length; i++){
      if(stack_clone[i].id == state_obj.id){
        edit_id = i
      }
    }
    if(edit_id != -1){
      stack_clone[edit_id] = state_obj
    }else{
      stack_clone.push(state_obj)
    }
    this.setState({stack_items: stack_clone})

    var clone = JSON.parse(JSON.stringify(this.state.my_contract_applications))
    clone[state_obj.picked_contract['id']] = state_obj.application_expiry_time
    this.setState({my_contract_applications: clone})
  }










  render_view_application_contract_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_view_application_contract_bottomsheet.bind(this)} open={this.state.view_application_contract_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-60, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ViewApplicationContractPage ref={this.view_application_contract_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} add_job_acceptance_action_to_stack={this.add_job_acceptance_action_to_stack.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_view_application_contract_bottomsheet(){
    if(this.state != null){
      this.setState({view_application_contract_bottomsheet: !this.state.view_application_contract_bottomsheet});
    }
  }

  show_view_application_contract_bottomsheet(item){
    if(this.view_application_contract_page.current != null){
      this.view_application_contract_page.current.set_object(item)
    }

    this.open_view_application_contract_bottomsheet()
  }


  add_job_acceptance_action_to_stack(state_obj){
    var stack_clone = this.state.stack_items.slice()      
    stack_clone.push(state_obj)
    this.setState({stack_items: stack_clone})

    this.show_enter_contract_bottomsheet(state_obj.application_item['contract'])
    this.open_view_application_contract_bottomsheet()
  }












  render_view_transaction_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_view_transaction_bottomsheet.bind(this)} open={this.state.view_transaction_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-90, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ViewTransactionPage ref={this.view_transaction_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)} show_images={this.show_images.bind(this)} open_edit_object_uis={this.open_edit_object_uis.bind(this)} delete_transaction={this.delete_transaction.bind(this)} show_hide_stack_item={this.show_hide_stack_item.bind(this)} delete_message_item={this.delete_message_item.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_view_transaction_bottomsheet(){
    if(this.state != null){
      this.setState({view_transaction_bottomsheet: !this.state.view_transaction_bottomsheet});
    }
  }

  show_view_transaction_bottomsheet(item, index){
    if(this.view_transaction_page.current != null){
      this.view_transaction_page.current.set_transaction(item, index)
    }

    this.open_view_transaction_bottomsheet()
  }


  delete_transaction(item){
    var stack_clone = this.state.stack_items.slice()
    const index = stack_clone.indexOf(item);
    if (index > -1) { // only splice array when item is found
      stack_clone.splice(index, 1); // 2nd parameter means remove one item only
    }
    this.setState({stack_items: stack_clone})
    this.open_view_transaction_bottomsheet()
  }


  open_edit_object_uis(tx){
    if(tx.type == 'contract'){
        this.open_new_object('1')
        if(this.new_contract_page.current){
          this.new_contract_page.current?.set_state(tx)
        }
    }
    else if(tx.type == 'token'){
        this.open_new_object('8')
        if(this.new_token_page.current){
          this.new_token_page.current?.set_state(tx)
        }
    }
    else if(tx.type == 'subscription'){
        this.open_new_object('3')
        if(this.new_subscription_page.current){
          this.new_subscription_page.current?.set_state(tx)
        }
    }
    else if(tx.type == 'post'){
        this.open_new_object('6')
        if(this.new_post_page.current){
          this.new_post_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'job'){
        this.open_new_object('0')
        if(this.new_job_page.current){
          this.new_job_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'channel'){
        this.open_new_object('7')
        if(this.new_channel_page.current){
          this.new_channel_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'storefront'){
        this.open_new_object('4')
        if(this.new_storefront_page.current){
          this.new_storefront_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'buy-sell'){
      this.open_mint_token_bottomsheet()
      if(this.new_mint_dump_token_page.current){
        this.new_mint_dump_token_page.current?.setState(tx)
      }
    }
    else if(tx.type == 'transfer'){
      this.open_transfer_token_bottomsheet()
      if(this.new_transfer_token_page.current){
        this.new_transfer_token_page.current?.setState(tx)
      }
    }
    else if(tx.type == 'enter-contract'){
      this.open_enter_contract_bottomsheet()
      if(this.enter_contract_page.current){
        this.enter_contract_page.current?.setState(tx)
      } 
    }
    else if(tx.type == 'extend-contract'){
      this.open_extend_contract_bottomsheet()
      if(this.extend_contract_page.current){
        this.extend_contract_page.current?.setState(tx)
      } 
    }
    else if(tx.type == 'proposal'){
      this.open_new_proposal_bottomsheet()
      if(this.new_proposal_page.current){
        this.new_proposal_page.current?.setState(tx)
      } 
    }
    else if(tx.type == 'vote'){
      this.open_vote_proposal_bottomsheet()
      if(this.vote_proposal_page.current){
        this.vote_proposal_page.current?.setState(tx)
      }
    }
    else if(tx.type == 'pay-subscription'){
      this.open_pay_subscription_bottomsheet()
      if(this.pay_subscription_page.current){
        this.pay_subscription_page.current?.setState(tx)
      } 
    }
    else if(tx.type == 'cancel-subscription'){
      this.open_cancel_subscription_bottomsheet()
      if(this.cancel_subscription_page.current){
        this.cancel_subscription_page.current?.setState(tx)
      }
    }
    else if(tx.type == 'modify-subscription'){
        this.open_modify_subscription_bottomsheet()
        if(this.modify_subscription_page.current){
          this.modify_subscription_page.current?.setState(tx)
        }
    }   
    else if(tx.type == 'modify-contract'){
        this.open_modify_contract_bottomsheet()
        if(this.modify_contract_page.current){
          this.modify_contract_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'modify-token'){
        this.open_modify_token_bottomsheet()
        if(this.modify_token_page.current){
          this.modify_token_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'exchange-transfer'){
        this.open_exchange_transfer_bottomsheet()
        if(this.exchange_transfer_page.current){
          this.exchange_transfer_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'force-exit'){
        this.open_force_exit_bottomsheet()
        if(this.force_exit_page.current){
          this.force_exit_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'archive'){
        this.open_archive_proposal_bottomsheet()
        if(this.archive_proposal_page.current){
          this.archive_proposal_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'freeze/unfreeze'){
        this.open_freeze_unfreeze_bottomsheet()
        if(this.freeze_unfreeze_page.current){
          this.freeze_unfreeze_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'authmint'){
        this.open_authmint_bottomsheet()
        if(this.authmint_page.current){
          this.authmint_page.current?.setState(tx)
        }
    }
    else if(tx.type == 'access-rights-settings'){
        this.open_moderator_bottomsheet()
        if(this.moderator_page.current){
          this.moderator_page.current?.setState(tx)
        }  
    }
    else if(tx.type == 'mail'){
        this.open_new_object('5')
        if(this.new_mail_page.current){
          this.new_mail_page.current?.setState(tx)
        } 
    }  
    else if(tx.type == 'job-response'){
        this.open_respond_to_job_bottomsheet()
        if(this.respond_to_job_page.current){
          this.respond_to_job_page.current?.setState(tx)
        }   
    }
        
  }

  delete_message_item(item, transaction_item){
    var stack = this.state.stack_items.slice()
    var pos = -1
    for(var i=0; i<stack.length; i++){
      if(stack[i].id == transaction_item.id){
        pos = i
        break;
      }
    }
    if(pos != -1){
      const index = stack[pos].messages_to_deliver.indexOf(item);
      if (index > -1) { // only splice array when item is found
        stack[pos].messages_to_deliver.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.setState({stack_items: stack})
    }
    

  }








  render_view_transaction_log_bottomsheet(){
    var background_color = this.state.theme['send_receive_ether_background_color'];
    var size = this.getScreenSize();
    return(
      <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_view_transaction_log_bottomsheet.bind(this)} open={this.state.view_transaction_log_bottomsheet} style={{'z-index':'5'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': this.state.theme['send_receive_ether_overlay_background'],'box-shadow': '0px 0px 0px 0px '+this.state.theme['send_receive_ether_overlay_shadow']}}>
          <div style={{ height: this.state.height-90, 'background-color': background_color, 'border-style': 'solid', 'border-color': this.state.theme['send_receive_ether_overlay_background'], 'border-radius': '1px 1px 0px 0px', 'border-width': '0px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['send_receive_ether_overlay_shadow'],'margin': '0px 0px 0px 0px', 'overflow-y':'auto'}}>  
            <ViewTransactionLogPage ref={this.view_transaction_log_page} app_state={this.state} size={size} height={this.state.height} theme={this.state.theme} notify={this.prompt_top_notification.bind(this)}/>
          </div>
      </SwipeableBottomSheet>
    )
  }

  open_view_transaction_log_bottomsheet(){
    if(this.state != null){
      this.setState({view_transaction_log_bottomsheet: !this.state.view_transaction_log_bottomsheet});
    }
  }

  show_view_transaction_log_bottomsheet(item){
    if(this.view_transaction_log_page.current != null){
      this.view_transaction_log_page.current.set_transaction(item)
    }
    this.open_view_transaction_log_bottomsheet()
  }











  render_view_image_bottomsheet(){
      var background_color = 'transparent';
      return(
        <SwipeableBottomSheet  overflowHeight={0} marginTop={0} onChange={this.open_view_image_bottomsheet.bind(this)} open={this.state.view_image_bottomsheet} style={{'z-index':'6'}} bodyStyle={{'background-color': 'transparent'}} overlayStyle={{'background-color': 'transparent','box-shadow': '0px 0px 0px 0px #CECDCD'}}>
            <div style={{ height: this.state.height, width: this.state.width, 'background-color': background_color, 'border-style': 'solid', 'border-color': 'black', 'border-radius': '0px 0px 0px 0px', 'border-width': '0px','margin': '0px 0px 0px 0px'}}>
                {this.render_view_image()}
            </div>
        </SwipeableBottomSheet>
      )
    }

    open_view_image_bottomsheet(){
        if(this.state != null){
            this.setState({view_image_bottomsheet: !this.state.view_image_bottomsheet});
        }
    }

    show_images(images, pos){
      this.setState({view_images:images, view_images_pos: pos })
      this.open_view_image_bottomsheet()
    }

    /* fullscreen image rendered in bottomsheet when image item is tapped */
    render_view_image(){
      var images = this.state.view_images == null ? [] : this.state.view_images;
      var pos = this.state.view_images_pos == null ? 0 : this.state.view_images_pos;
      return(
        <div style={{'position': 'relative', height:'100%', width:'100%', 'background-color':'rgb(0, 0, 0,.9)','border-radius': '0px','display': 'flex', 'align-items':'center','justify-content':'center', 'margin':'0px 0px 0px 0px'}}>
          <SwipeableViews index={pos}>
            {images.map((item, index) => ( 
              <img src={item} style={{height:'auto',width:'100%'}} />
            ))}
          </SwipeableViews>
        </div> 
      );
    }

    when_view_image_clicked(index, images){
        this.setState({view_images: images, view_images_pos: index})
        this.open_view_image_bottomsheet()
    }

















  /* prompts an alert notification from the top */
  prompt_top_notification(data, duration){
      var time = duration == null ? 1000: duration;
      // data = 'toast item blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah '
      // time = 1500000
      toast(this.render_toast_item(data), {
          position: "top-center",
          autoClose: time,
          closeButton: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
          containerId:"id",
          toastId:data,
          hideProgressBar: true,
          style:{'background-color':'transparent','box-shadow': '0px 0px 0px 0px #CECDCD', width:'auto'}
      });
  }


  /* renders the toast item used */
  render_toast_item(message){
    var width = this.state.width
    if(width > 400){
      width = 350
    }
    return (
          <div>
              <div style={{'background-color':this.state.theme['toast_background_color'], 'border-radius': '20px', 'box-shadow': '0px 0px 2px 1px '+this.state.theme['card_shadow_color'],'padding': '3px 3px 3px 3px','display': 'flex','flex-direction': 'row', width: width-40}}>
                  <div style={{'padding': '10px 0px 5px 5px','display': 'flex','align-items': 'center', height:35}}> 
                      <img src={AlertIcon} style={{height:25,width:'auto','scale': '0.9'}} />
                  </div>
                  <div style={{'padding': '0px 0px 0px 8px', 'margin':'5px 0px 0px 0px','display': 'flex','align-items': 'center'}}>
                      <p style={{'font-size': '13px', 'color':this.state.theme['primary_text_color'],'text-shadow': '-0px -0px 0px #A1A1A1', 'margin':'0px'}}>{message}</p>
                  </div>
              </div>
          </div>
      );
  }














  load_e5_data = async () => {
    this.setState({should_keep_synchronizing_bottomsheet_open: true});
    

    const web3 = new Web3('ws://127.0.0.1:8545/');
    const contractArtifact = require('./contract_abis/E5.json');
    const contractAddress = '0x95401dc811bb5740090279Ba06cfA8fcF6113778'
    const contractInstance = new web3.eth.Contract(contractArtifact.abi, contractAddress);


    var contract_addresses_events = await contractInstance.getPastEvents('e7', { fromBlock: 0, toBlock: 'latest' }, (error, events) => {});
    var contract_addresses = contract_addresses_events[0].returnValues.p5

    await web3.eth.net.getId().then(id =>{
      this.inc_synch_progress()
      this.setState({chain_id: id});
    })

    await web3.eth.net.getPeerCount().then(peers =>{
      this.setState({ number_of_peers: peers});
      this.inc_synch_progress()
    })

    await web3.eth.net.getNetworkType().then(type =>{
      this.setState({ network_type: type});
      this.inc_synch_progress()
    })

    web3.eth.getBlockNumber().then(blockNumber => {
        var last_blocks = [];
        var start = blockNumber-100;
        if(blockNumber < 100){
          start = 0;
        }
        for (let i = start; i <= blockNumber; i++) {
          web3.eth.getBlock(i).then(block => {
            last_blocks.push(block);
          })
        }

        this.setState({E15last_blocks: last_blocks, E15number_of_blocks: blockNumber});
        this.inc_synch_progress()
    });

    const gasPrice = await web3.eth.getGasPrice();
    this.setState({gas_price: gasPrice})



    contractInstance.events['e4']({
      filter: { p1/* sender_account_id */: 1002 }
    })
    .on('data', event => {
      console.log('Event:', event);
      
    })
    .on('error', error => {
      console.error('Error-----------:', error);
    });

    this.when_wallet_data_updated(['(32)'], 0, '')
    this.inc_synch_progress()

    

    const G5contractArtifact = require('./contract_abis/G5.json');
    const G5_address = contract_addresses[3].toString()
    const G5contractInstance = new web3.eth.Contract(G5contractArtifact.abi, G5_address);
    var main_contract_ids = [2];
    G5contractInstance.methods.f78(main_contract_ids, false).call((error, result) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({E15_contract_data: result, contract_id_data:['E35']});
        this.inc_synch_progress()
      }
    });

    const H5contractArtifact = require('./contract_abis/H5.json');
    const H5_address = contract_addresses[5].toString()
    const H5contractInstance = new web3.eth.Contract(H5contractArtifact.abi, H5_address);
    var token_ids = [3, 5];
    H5contractInstance.methods.f86(token_ids).call((error, result) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({E15_exchange_data: result, E15_exchange_id_data:token_ids});
        this.inc_synch_progress()
        
      }
    });

  }

  inc_synch_progress(){
    const steps = this.state.sync_steps;
    const incr_count = 100/steps;
    if(this.state.syncronizing_progress+incr_count >= 100 && this.state.should_keep_synchronizing_bottomsheet_open == true){
      this.prompt_top_notification('syncronized!', 500);
      this.setState({should_keep_synchronizing_bottomsheet_open: false})
    }
    this.setState({syncronizing_progress:this.state.syncronizing_progress+incr_count})

  }

  send_ether_to_target(recipientAddress, amount, gasPrice, state){
    const web3 = new Web3(this.state.web3);
    const me = this;
    web3.eth.sendTransaction({
    from: state.account.address,
    to: recipientAddress,
    value: amount.toString(),
    gasPrice: gasPrice.toString() // Adjust gas price as needed
  }).on('transactionHash', function (hash) {
      console.log('Transaction sent:', hash);

      web3.eth.getTransaction(hash).then(tx => {
          var transactions = state.account_transaction_history.slice();
          transactions.push(tx)
          me.setState({account_transaction_history: transactions})
          
          setTimeout(function() {
            me.prompt_top_notification('transaction completed!', 1200)
          }, (3 * 1000));
      })
      
      web3.eth.getBalance(state.account.address).then(balance => {
        me.setState({account_balance: balance});
      }).catch(error => {
        console.error('Error:', error);
      });
    })
    .on('error', function (error) {
      console.error('Failed to send transaction:', error);
    });
  }


  when_wallet_data_updated(added_tags, set_salt, selected_item){
    var seed = added_tags.join(' | ') + set_salt + selected_item;

    const web3 = new Web3(this.state.web3);
    const account = this.get_account_from_seed(seed);
    this.setState({account: account});

    web3.eth.getBalance(account.address).then(balance => {
      this.setState({account_balance: balance});
    }).catch(error => {
      console.error('Error:', error);
    });

    this.get_filecoin_wallet(seed);
    this.get_accounts_data(account, true)
  }

  get_account_from_seed(seed){
    const web3 = new Web3(this.state.web3);
    const mnemonic = seed.trim();
    const seedBytes = mnemonicToSeedSync(mnemonic);
    const hdNode = ethers.utils.HDNode.fromSeed(seedBytes);
    const wallet = new ethers.Wallet(hdNode.privateKey);

    const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    return account;
  }

  get_filecoin_wallet = async (seed) => {
    const connector = new HttpJsonRpcConnector({ url: 'https://rpc.ankr.com/filecoin', token: '' });
    const hdWalletMnemonic = seed;
    const hdDerivationPath = `m/44'/461'/0'/0/0`;
    const lotusClient = new LotusClient(connector);

    const walletProvider = new MnemonicWalletProvider( lotusClient, hdWalletMnemonic, hdDerivationPath );
    const myAddress = await walletProvider.getDefaultAddress();
    console.log(myAddress);

    const balance = await lotusClient.wallet.balance(myAddress);
    console.log('Wallet balance:', balance);

    // this.send_filecoin(seed)
    // this.initialize_storage_deal(seed)
  }

  send_filecoin = async (seed) => {
    const provider = new HttpJsonRpcConnector({ url: 'https://api.node.glif.io', token: '' });
    const lotusClient = new LotusClient(provider);
    const hdDerivationPath = `m/44'/461'/0'/0/0`;
    const walletProvider = new MnemonicWalletProvider(lotusClient, seed, hdDerivationPath);

    const recipientAddress = 'f1vyte2sq5qcntdchamob3efvaapay5e4eebuwfty';
    const amount = '1000000000000'; // Amount in FIL (1 FIL = 1e18)
    const myAddress = await walletProvider.getDefaultAddress();

    console.log('walletProvider.address:---------------',myAddress)
    console.log(walletProvider)

    var privateKey = await walletProvider.getSigner().getPrivateKey(myAddress)
    console.log('private key: ---------------',privateKey);


    const nonce = await lotusClient.mpool.getNonce(myAddress);

    // Send the transaction
    const message = await walletProvider.createMessage({
      From: myAddress,
      To: recipientAddress,
      Value: amount.toString().toLocaleString('fullwide', {useGrouping:false}),
      GasPrice: '1000000000',
      GasLimit: 900000,
      gasPremium: 17768082,
      GasFeeCap:17768082,
      Nonce: nonce,
    });

    try{
      const cid = await walletProvider.sendSignedMessage(
        await walletProvider.signMessage(message)
      );
      console.log('Transaction CID:', cid);
    }catch(e){
      console.log(e)
    }




    

  }

  initialize_storage_deal = async (seed) => {
    const provider = new HttpJsonRpcConnector({ url: 'https://api.node.glif.io/rpc/v0', token: '' });
    const lotusClient = new LotusClient(provider);
    const hdDerivationPath = `m/44'/461'/0'/0/0`;
    const walletProvider = new MnemonicWalletProvider(lotusClient, seed, hdDerivationPath);

    const myAddress = await walletProvider.getDefaultAddress();

    console.log('walletProvider.address:---------------',myAddress)
    console.log(walletProvider)

    var privateKey = await walletProvider.getSigner().getPrivateKey(myAddress)
    console.log('private key: ---------------',privateKey);

    

    const minerAddress = 'f01393827';
    // const data = Buffer.from('Hello, World!');
    // const walletKey = WalletKey.fromPrivateKey(Buffer.from(privateKey, 'hex'));

    // Define storage deal parameters
    
    // const dealInfo = await walletProvider.client.client.startDeal({
    //   Data: data.toString('base64'),
    //   Wallet: myAddress,
    //   Miner: minerAddress,
    //   StartEpoch: 0, // Use -1 to start the deal ASAP
    //   EndEpoch: 10000, // Use 0 to make the deal perpetual
    //   PieceSize: 1000,
    //   VerifiedDeal: false,
    //   Client: myAddress
    // });

    // console.log('Storage Deal CID:', dealInfo.ProposalCid);

  }

  


  get_transaction_history = async (account) => {
    const web3 = new Web3(this.state.web3);
    
    let block = await web3.eth.getBlock('latest');
    this.setState({current_block: block});

    let number = block.number;
    const targetAddress = account.address;
    var transactions = []
    var start = 0;
    const blocks_checked = 50;
    if(number > blocks_checked){
      start = number - blocks_checked
    }
    for (let i = start; i <= number; i++) {
      web3.eth.getBlock(i).then(block => {
        let txs = block.transactions;
        if (block != null && txs != null) {
          for (let txHash of txs) {

            web3.eth.getTransaction(txHash).then(tx => {
              if (targetAddress == tx.to || targetAddress == tx.from) {
                transactions.push(tx)
                const sortedData = this.sortByAttributeDescending(transactions, 'blockNumber');
                this.setState({account_transaction_history: sortedData})
              }
            })
            
          }
        }
      });
    }
  }

  sortByAttributeDescending(array, attribute) {
      return array.sort((a, b) => {
          if (a[attribute] < b[attribute]) {
          return 1;
          }
          if (a[attribute] > b[attribute]) {
          return -1;
          }
          return 0;
      });
  }

  get_accounts_data = async (account, is_syncing) => {
    const web3 = new Web3(this.state.web3);
    const contractArtifact = require('./contract_abis/E5.json');
    const contractAddress = this.state.e5_address
    const contractInstance = new web3.eth.Contract(contractArtifact.abi, contractAddress);

    /* ---------------------------------------- CONTRACT ADDRESSES -------------------------------------- */
    var contract_addresses_events = await contractInstance.getPastEvents('e7', { fromBlock: 0, toBlock: 'latest' }, (error, events) => {});
    var contract_addresses = contract_addresses_events[0].returnValues.p5
    this.setState({E35_addresses: contract_addresses})

    if(is_syncing){
      this.inc_synch_progress()
    }
    





    /* ---------------------------------------- ACCOUNT DATA ------------------------------------------- */
    var accounts = await contractInstance.methods.f167([],[account.address], 2).call((error, result) => {});
    console.log('account id----------------',accounts[0])
    var account = accounts[0] == 0 ? 1 : accounts[0]
    this.setState({user_account_id: account})

    if(is_syncing){
      this.inc_synch_progress()
    }

    var events = await contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p1/* sender_account_id */: account } }, (error, events) => {});
    this.setState({E15_runs: events});
    console.log(events[0])

    if(is_syncing){
      this.inc_synch_progress()
    }


    const E52contractArtifact = require('./contract_abis/E52.json');
    const E52_address = contract_addresses[1];
    const E52contractInstance = new web3.eth.Contract(E52contractArtifact.abi, E52_address);







    /* ---------------------------------------- SUBSCRIPTION DATA ------------------------------------------- */
    const F5contractArtifact = require('./contract_abis/F5.json');
    const F5_address = contract_addresses[2];
    const F5contractInstance = new web3.eth.Contract(F5contractArtifact.abi, F5_address);
    
    var created_subscription_events = await contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* object_type */:33/* subscription_object */ } }, (error, events) => {});
    var created_subscriptions = []
    for(var i=0; i<created_subscription_events.length; i++){
      var id = created_subscription_events[i].returnValues.p1
      created_subscriptions.push(id)
    }
    var created_subscription_data = await F5contractInstance.methods.f74(created_subscriptions).call((error, result) => {});
    var created_subscription_object_data = []
    for(var i=0; i<created_subscriptions.length; i++){
      var subscription_data = await this.fetch_objects_data(created_subscriptions[i], web3);
      var my_payment = await F5contractInstance.methods.f229([created_subscriptions[i]], [[account]]).call((error, result) => {});

      var paid_accounts = [];
      var paid_amounts = [];

      if(created_subscription_events[i].returnValues.p3 == account){
        //if the sender is the authority of the subscription
        var all_subscription_payment_events = await F5contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* subscription_id */:created_subscriptions[i] } }, (error, events) => {});
        
        for(var j=0; j<all_subscription_payment_events.length; j++){
          var account_in_focus = all_subscription_payment_events[j].returnValues.p2
          
          if(!paid_accounts.includes(account_in_focus)){
            var collectible_time_value = await F5contractInstance.methods.f235([created_subscriptions[i]], [[account_in_focus]]).call((error, result) => {});
            
            if(collectible_time_value[0][0] != 0){
              paid_accounts.push(account_in_focus)
              paid_amounts.push(collectible_time_value[0][0])
            }
          }
        }
      }

      var moderator_data = await E52contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_obj_id */:created_subscriptions[i], p2/* action_type */:4/* <4>modify_moderator_accounts */} }, (error, events) => {});
      var old_moderators = []

      for(var e=0; e<moderator_data.length; e++){
        var mod_id = moderator_data[e].returnValues.p3
        old_moderators.push(mod_id)
      }

      var mod_status_values = await E52contractInstance.methods.f255([created_subscriptions[i]], [old_moderators]).call((error, result) => {});

      var moderators = []
      for(var e=0; e<old_moderators.length; e++){
        var their_status = mod_status_values[0][e]
        if(their_status == true){
          moderators.push(old_moderators[e])
        }
      }

      var interactible_checker_status_values = await E52contractInstance.methods.f254([created_subscriptions[i]],0).call((error, result) => {});

      var my_interactable_time_value = await E52contractInstance.methods.f256([created_subscriptions[i]], [[account]], 0,2).call((error, result) => {});

      var my_blocked_time_value = await E52contractInstance.methods.f256([created_subscriptions[i]], [[account]], 0,3).call((error, result) => {});

      if(interactible_checker_status_values[0] == true && (my_interactable_time_value[0][0] < Date.now()/1000 && !moderators.includes(account) && created_subscription_events[i].returnValues.p3 != account )){}
      else if(my_blocked_time_value[0][0] > Date.now()/1000){}
      else{
        created_subscription_object_data.push({'id':created_subscriptions[i], 'data':created_subscription_data[i], 'ipfs':subscription_data, 'event':created_subscription_events[i], 'payment':my_payment[0][0], 'paid_accounts':paid_accounts, 'paid_amounts':paid_amounts, 'moderators':moderators, 'access_rights_enabled':interactible_checker_status_values[0]})
      }

      
    }
    this.setState({created_subscriptions: created_subscription_object_data})
    console.log('subscription count: '+created_subscription_object_data.length)

    var all_subscription_events = await contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* object_type */:33/* subscription_object */ } }, (error, events) => {});
    
    this.setState({all_subscriptions: all_subscription_events})


    if(is_syncing){
      this.inc_synch_progress()
    }






    /* ---------------------------------------- CONTRACT DATA ------------------------------------------- */
    const G5contractArtifact = require('./contract_abis/G5.json');
    const G5_address = contract_addresses[3];
    const G5contractInstance = new web3.eth.Contract(G5contractArtifact.abi, G5_address);

    const G52contractArtifact = require('./contract_abis/G52.json');
    const G52_address = contract_addresses[4];
    const G52contractInstance = new web3.eth.Contract(G52contractArtifact.abi, G52_address);

    var created_contract_events = await contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* object_type */:30/* contract_obj_id */ } }, (error, events) => {});
    var created_contracts = [2]
    var accounts_for_expiry_time = [[account]]
    for(var i=0; i<created_contract_events.length; i++){
      var id = created_contract_events[i].returnValues.p1
      created_contracts.push(id)
      accounts_for_expiry_time.push([account])
    }

    var created_contract_data = await G5contractInstance.methods.f78(created_contracts, false).call((error, result) => {});
    var entered_timestamp_data = await G52contractInstance.methods.f266(created_contracts, accounts_for_expiry_time, 3).call((error, result) => {});
    var created_contract_object_data = []
    var created_contract_mapping = {}
    for(var i=0; i<created_contracts.length; i++){
      var contracts_data = await this.fetch_objects_data(created_contracts[i], web3);
      var event = i>0 ? created_contract_events[i-1]: null
      var end_balance = await this.get_balance_in_exchange(3, created_contracts[i]);
      var spend_balance = await this.get_balance_in_exchange(5, created_contracts[i]);

      var entered_accounts = await G52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p3/* action */:3/* enter_contract(3) */,p1/* contract_id */:created_contracts[i] } }, (error, events) => {});

      var contract_entered_accounts = []
      for(var e=0; e<entered_accounts.length; e++){
        var account_entered_time = await G52contractInstance.methods.f266([created_contracts[i]], [[entered_accounts[e].returnValues.p2]], 3).call((error, result) => {});

        if(!contract_entered_accounts.includes(entered_accounts[e].returnValues.p2) && account_entered_time > Date.now()/1000){
          contract_entered_accounts.push(entered_accounts[e].returnValues.p2)
        }
      }


      var moderator_data = await E52contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_obj_id */:created_subscriptions[i], p2/* action_type */:4/* <4>modify_moderator_accounts */} }, (error, events) => {});
      var old_moderators = []

      for(var e=0; e<moderator_data.length; e++){
        var mod_id = moderator_data[e].returnValues.p3
        old_moderators.push(mod_id)
      }

      var mod_status_values = await E52contractInstance.methods.f255([created_contracts[i]], [old_moderators]).call((error, result) => {});

      var moderators = []
      for(var e=0; e<old_moderators.length; e++){
        var their_status = mod_status_values[0][e]
        if(their_status == true){
          moderators.push(old_moderators[e])
        }
      }

      var interactible_checker_status_values = await E52contractInstance.methods.f254([created_contracts[i]],0).call((error, result) => {});

      var my_interactable_time_value = await E52contractInstance.methods.f256([created_contracts[i]], [[account]], 0,2).call((error, result) => {});

      var my_blocked_time_value = await E52contractInstance.methods.f256([created_contracts[i]], [[account]], 0,3).call((error, result) => {});

      var contract_obj = {'id':created_contracts[i], 'data':created_contract_data[i], 'ipfs':contracts_data, 'event':event, 'entry_expiry':entered_timestamp_data[i][0], 'end_balance':end_balance, 'spend_balance':spend_balance, 'participants':contract_entered_accounts, 'archive_accounts':contract_entered_accounts, 'moderators':moderators, 'access_rights_enabled':interactible_checker_status_values[0], 'my_interactable_time_value':my_interactable_time_value[0][0], 'my_blocked_time_value':my_blocked_time_value[0][0] }

      if(interactible_checker_status_values[0] == true && (my_interactable_time_value[0][0] < Date.now()/1000 && !moderators.includes(account) && event.returnValues.p3 != account )){
      }
      else if(my_blocked_time_value[0][0] > Date.now()/1000){

      }
      else{
        created_contract_object_data.push(contract_obj)
      }
      created_contract_mapping[created_contracts[i]] = contract_obj
    }

    this.setState({created_contracts: created_contract_object_data, created_contract_mapping: created_contract_mapping})
    console.log('contract count: '+created_contract_object_data.length)

    var all_contract_events = await contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* object_type */:30/* contract_obj_id */ } }, (error, events) => {});
    this.setState({all_contracts: all_contract_events})


    if(is_syncing){
      this.inc_synch_progress()
    }







    /* ---------------------------------------- PROPOSAL DATA ------------------------------------------- */
    var contracts_ive_entered_events = await G52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p2/* sender_acc */:account, p3/* action */:3 /* <3>enter_contract */} }, (error, events) => {});
    var contracts_ive_entered = []
    for(var i=0; i<contracts_ive_entered_events.length; i++){
      var contract = contracts_ive_entered_events[i].returnValues.p1
      contracts_ive_entered.push(contract)
    }

    var contracts_ive_exited_events = await G52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p2/* sender_acc */:account, p3/* action */:11 /* <11>exit_contract */} }, (error, events) => {});
    for(var i=0; i<contracts_ive_exited_events.length; i++){
      var contract = contracts_ive_exited_events[i].returnValues.p1
      const index = contracts_ive_entered.indexOf(contract);
      if (index > -1) { // only splice array when item is found
          contracts_ive_entered.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    var all_force_exit_events = await G52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p3/* action */:18 /* <18>contract_force_exit_accounts */} }, (error, events) => {});
    for(var i=0; i<all_force_exit_events.length; i++){
      if(all_force_exit_events[i].returnValues.p5 == account.toString()){
        var force_exit_contract_id = all_force_exit_events[i].returnValues.p1
        const index = contracts_ive_entered.indexOf(force_exit_contract_id);
        if (index > -1) { // only splice array when item is found
            contracts_ive_entered.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
    }

    var my_proposals_events = []
    var my_proposal_ids = []
    for(var i=0; i<contracts_ive_entered.length; i++){
      var contracts_proposals = await G5contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* contract_id */:contracts_ive_entered[i]} }, (error, events) => {});
      console.log('---------------------------eee------------------------')
      console.log(contracts_proposals)

      for(var i=0; i<contracts_proposals.length; i++){
        my_proposal_ids.push(parseInt(contracts_proposals[i].returnValues.p2)) //<--------issue! should be p4
        
        my_proposals_events.push(contracts_proposals[i])
      }

    }

    var contracts_proposals = await G5contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* contract_id */:2} }, (error, events) => {});

    for(var i=0; i<contracts_proposals.length; i++){
      my_proposal_ids.push(parseInt(contracts_proposals[i].returnValues.p2))//<--------issue! should be p4
      my_proposals_events.push(contracts_proposals[i])
    }

    var created_proposal_object_data = []
    var created_proposal_data = await G5contractInstance.methods.f78(my_proposal_ids, false).call((error, result) => {});
    var consensus_data = await G52contractInstance.methods.f266(my_proposal_ids, [], 0).call((error, result) => {});
    for(var i=0; i<my_proposal_ids.length; i++){
      var proposals_data = await this.fetch_objects_data(my_proposal_ids[i], web3);
      var event = my_proposals_events[i]
      var end_balance = await this.get_balance_in_exchange(3, my_proposal_ids[i]);
      var spend_balance = await this.get_balance_in_exchange(5, my_proposal_ids[i]);

      var proposal_modify_target_type = await E52contractInstance.methods.f135(created_proposal_data[i][1][9]).call((error, result) => {});

      var senders_vote_in_proposal = await G52contractInstance.methods.f237([my_proposal_ids[i]], [[account]]).call((error, result) => {});

      var proposal_voters = await G52contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* consensus_id */:my_proposal_ids[i]} }, (error, events) => {});
      var archive_participants = []
      for(var o=0; o<proposal_voters.length; o++){
        if(!archive_participants.includes(proposal_voters[o].returnValues.p3)){
          archive_participants.push(proposal_voters[o].returnValues.p3)
        }
      }

      var obj = {'id':my_proposal_ids[i], 'data':created_proposal_data[i], 'ipfs':proposals_data, 'event':event, 'end_balance':end_balance, 'spend_balance':spend_balance, 'consensus_data':consensus_data[i], 'modify_target_type':proposal_modify_target_type, 'account_vote':senders_vote_in_proposal[0][0], 'archive_accounts':archive_participants }

      console.log('---------------------------ter------------------------')
      console.log(obj)

      created_proposal_object_data.push(obj)
    }

    this.setState({my_proposals: created_proposal_object_data})
    console.log('contract count: '+created_proposal_object_data.length)
    
    
    if(is_syncing){
      this.inc_synch_progress()
    }







    /* ---------------------------------------- TOKEN DATA ------------------------------------------- */
    const H5contractArtifact = require('./contract_abis/H5.json');
    const H5_address = contract_addresses[5];
    const H5contractInstance = new web3.eth.Contract(H5contractArtifact.abi, H5_address);

    const H52contractArtifact = require('./contract_abis/H52.json');
    const H52_address = contract_addresses[6];
    const H52contractInstance = new web3.eth.Contract(H52contractArtifact.abi, H52_address);

    var created_token_events = await contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* object_type */:31/* token_exchange */ } }, (error, events) => {});
    var created_tokens = [3, 5]
    var created_token_depths = [0,0]
    var exchange_accounts = [account, account]
    for(var i=0; i<created_token_events.length; i++){
      var id = created_token_events[i].returnValues.p1
      created_tokens.push(id)
      created_token_depths.push(0)
      exchange_accounts.push(account)
    }

    var created_token_data = await H5contractInstance.methods.f86(created_tokens).call((error, result) => {});
    var token_balances = await H52contractInstance.methods.f140e(created_tokens, account, created_token_depths).call((error, result) => {});

    var accounts_exchange_data = await H5contractInstance.methods.f241(exchange_accounts, created_tokens).call((error, result) => {});
    
    var created_token_object_data = []
    for(var i=0; i<created_tokens.length; i++){
      var tokens_data = await this.fetch_objects_data(created_tokens[i], web3);
      var event = i>1 ? created_token_events[i-2]: null

      var depth_values = []
      for(var j=0; j<created_token_data[i][3].length; j++){
        depth_values.push(0)
      }
      var exchanges_balances = await H52contractInstance.methods.f140e(created_token_data[i][3], created_tokens[i], depth_values).call((error, result) => {});



      var moderator_data = await E52contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_obj_id */:created_subscriptions[i], p2/* action_type */:4/* <4>modify_moderator_accounts */} }, (error, events) => {});
      var old_moderators = []

      for(var e=0; e<moderator_data.length; e++){
        var mod_id = moderator_data[e].returnValues.p3
        old_moderators.push(mod_id)
      }

      var mod_status_values = await E52contractInstance.methods.f255([created_tokens[i]], [old_moderators]).call((error, result) => {});

      var moderators = []
      for(var e=0; e<old_moderators.length; e++){
        var their_status = mod_status_values[0][e]
        if(their_status == true){
          moderators.push(old_moderators[e])
        }
      }

      var interactible_checker_status_values = await E52contractInstance.methods.f254([created_tokens[i]],0).call((error, result) => {});

      var my_interactable_time_value = await E52contractInstance.methods.f256([created_tokens[i]], [[account]], 0,2).call((error, result) => {});

      var my_blocked_time_value = await E52contractInstance.methods.f256([created_tokens[i]], [[account]], 0,3).call((error, result) => {});

      if(interactible_checker_status_values[0] == true && (my_interactable_time_value[0][0] < Date.now()/1000 && !moderators.includes(account) && event.returnValues.p3 != account )){

      }
      else if(my_blocked_time_value[0][0] > Date.now()/1000){

      }
      else{
        created_token_object_data.push({'id':created_tokens[i], 'data':created_token_data[i], 'ipfs':tokens_data, 'event':event, 'balance':token_balances[i], 'account_data':accounts_exchange_data[i], 'exchanges_balances':exchanges_balances, 'moderators':moderators, 'access_rights_enabled':interactible_checker_status_values[0] })
      }

    }

    this.setState({created_tokens: created_token_object_data})
    console.log('token count: '+created_token_object_data.length)

    var all_token_events = await contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p2/* object_type */:31/* token_exchange_id */ } }, (error, events) => {});
    this.setState({all_tokens: all_token_events})


    var end_balance_of_E5 = await this.get_balance_in_exchange(3, 2)
    var spend_balance_of_E5 = await this.get_balance_in_exchange(5, 2)
    var end_balance_of_burn_account = await this.get_balance_in_exchange(3, 0)

    this.setState({end_balance_of_E5:end_balance_of_E5, spend_balance_of_E5:spend_balance_of_E5, end_balance_of_burn_account: end_balance_of_burn_account})

    var token_symbol_directory = {}
    for(var u=0; u<created_token_object_data.length; u++){
      var token_name = created_token_object_data[u]['ipfs'] == null ? 'tokens' : created_token_object_data[u]['ipfs'].entered_symbol_text
      var token_id = created_token_object_data[u]['id']
      if(token_id == 3) token_name = 'END'
      if(token_id == 5) token_name = 'SPEND'
      token_symbol_directory[token_id] = token_name;
    }
    this.setState({token_directory: token_symbol_directory});


    if(is_syncing){
      this.inc_synch_progress()
    }






    
    /* ---------------------------------------- POST DATA ------------------------------------------- */
    var created_post_events = await E52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p3/* item_type */: 18/* 18(post object) */ } }, (error, events) => {});
    var created_posts = []
    for(var i=0; i<created_post_events.length; i++){
      var id = created_post_events[i].returnValues.p2
      var hash = web3.utils.keccak256('en')
      if(created_post_events[i].returnValues.p1.toString() == hash.toString()){
        var post_data = await this.fetch_objects_data(id, web3);
        created_posts.push({'id':id, 'ipfs':post_data, 'event': created_post_events[i]})
      }
    }
    this.setState({created_posts: created_posts})
    console.log('post count: '+created_posts.length)


    if(is_syncing){
      this.inc_synch_progress()
    }







    /* ---------------------------------------- CHANNEL DATA ------------------------------------------- */
    var created_channel_events = await E52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p3/* item_type */: 36/* 36(type_channel_target) */ } }, (error, events) => {});
    var created_channel = []
    for(var i=0; i<created_channel_events.length; i++){
      var id = created_channel_events[i].returnValues.p2
      var hash = web3.utils.keccak256('en')
      if(created_channel_events[i].returnValues.p1.toString() == hash.toString()){
        var channel_data = await this.fetch_objects_data(id, web3);


        var moderator_data = await E52contractInstance.getPastEvents('e1', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_obj_id */:id, p2/* action_type */:4/* <4>modify_moderator_accounts */} }, (error, events) => {});
        var old_moderators = []

        for(var e=0; e<moderator_data.length; e++){
          var mod_id = moderator_data[e].returnValues.p3
          old_moderators.push(mod_id)
        }

        var mod_status_values = await E52contractInstance.methods.f255([id], [old_moderators]).call((error, result) => {});

        var moderators = []
        for(var e=0; e<old_moderators.length; e++){
          var their_status = mod_status_values[0][e]
          if(their_status == true){
            moderators.push(old_moderators[e])
          }
        }

        var interactible_checker_status_values = await E52contractInstance.methods.f254([id],0).call((error, result) => {});

        var my_interactable_time_value = await E52contractInstance.methods.f256([id], [[account]], 0,2).call((error, result) => {});

        var my_blocked_time_value = await E52contractInstance.methods.f256([id], [[account]], 0,3).call((error, result) => {});

        if(interactible_checker_status_values[0] == true && (my_interactable_time_value[0][0] < Date.now()/1000 || !moderators.includes(account))){

        }
        else if(my_blocked_time_value[0][0] > Date.now()/1000){

        }
        else{
          created_channel.push({'id':id, 'ipfs':channel_data, 'event': created_channel_events[i], 'messages':[], 'moderators':moderators, 'access_rights_enabled':interactible_checker_status_values[0], 'my_interactible_time_value':my_interactable_time_value[0][0], 'my_blocked_time_value':my_blocked_time_value[0][0] });
        }

      }
    }
    this.setState({created_channels: created_channel})
    console.log('channel count: '+created_channel.length)


    if(is_syncing){
      this.inc_synch_progress()
    }












    /* ---------------------------------------- JOB DATA ------------------------------------------- */
    var created_job_events = await E52contractInstance.getPastEvents('e2', { fromBlock: 0, toBlock: 'latest', filter: { p3/* item_type */: 17/* 17(job_object) */ } }, (error, events) => {});
    var created_job = []
    console.log('created job events-------------')
    console.log(await created_job_events)
    for(var i=0; i<created_job_events.length; i++){
      var id = created_job_events[i].returnValues.p2
      var hash = web3.utils.keccak256('en')
      if(created_job_events[i].returnValues.p1.toString() == hash.toString()){
        var job_data = await this.fetch_objects_data(id, web3);
        created_job.push({'id':id, 'ipfs':job_data, 'event': created_job_events[i]})
      }
    }

    var my_created_job_respnse_data = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p2/* target_id */: account, p3/* context */:36 } }, (error, events) => {});
    var my_applications = []
    var my_contract_applications = {}
    for(var i=0; i<my_created_job_respnse_data.length; i++){
      var ipfs_data = await this.fetch_objects_data_from_ipfs(my_created_job_respnse_data[i].returnValues.p4)
      my_applications.push({'ipfs':ipfs_data, 'event':my_created_job_respnse_data[i]})

      var picked_contract_id = ipfs_data['picked_contract_id']
      var application_expiry_time = ipfs_data['application_expiry_time']

      if(my_contract_applications[picked_contract_id] != null){
        if(my_contract_applications[picked_contract_id] < application_expiry_time){
          my_contract_applications[picked_contract_id] = application_expiry_time
        }
      }else{
        my_contract_applications[picked_contract_id] = application_expiry_time
      }
    }

    this.setState({created_jobs: created_job, my_applications:my_applications, my_contract_applications:my_contract_applications})
    console.log('job count: '+created_job.length)
    console.log('job applications count: '+my_applications.length)

    if(is_syncing){
      this.inc_synch_progress()
    }










    /* ---------------------------------------- MAIL DATA ------------------------------------------- */
    var my_created_mail_events = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p2/* sender_acc_id */: account, p3/* context */:30 } }, (error, events) => {});
    var created_mail = []
    var mail_activity = {}
    for(var i=0; i<my_created_mail_events.length; i++){
      var convo_id = my_created_mail_events[i].returnValues.p5
      var cid = my_created_mail_events[i].returnValues.p4
      
      var ipfs = await this.fetch_objects_data_from_ipfs(cid)

      if(!created_mail.includes(convo_id)){
        created_mail.push(convo_id)
        if(mail_activity[convo_id] == null){
          mail_activity[convo_id] = []
        }
      }
      var ipfs_obj = await this.get_ipfs_object(ipfs)
      mail_activity[convo_id].push({'convo_id':convo_id, 'event':my_created_mail_events[i], 'ipfs':ipfs_obj, 'type':'sent', 'time':my_created_mail_events[i].returnValues.p6, 'convo_with':my_created_mail_events[i].returnValues.p1, 'sender':my_created_mail_events[i].returnValues.p2, 'recipient':my_created_mail_events[i].returnValues.p1})
    }
    this.setState({created_mail: {'created_mail':created_mail, 'mail_activity':mail_activity}})
    console.log('created mail count: '+created_mail.length)

    if(is_syncing){
      this.inc_synch_progress()
    }


    var my_received_mail_events = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_id */: account, p3/* context */:30 } }, (error, events) => {});
    var received_mail = []
    var mail_activity = {}
    for(var i=0; i<my_received_mail_events.length; i++){
      var convo_id = my_received_mail_events[i].returnValues.p5
      var cid = my_received_mail_events[i].returnValues.p4
      var ipfs = await this.fetch_objects_data_from_ipfs(cid)

      if(!received_mail.includes(convo_id)){
        received_mail.push(convo_id)
        if(mail_activity[convo_id] == null){
          mail_activity[convo_id] = []
        }
      }
      var ipfs_obj = await this.get_ipfs_object(ipfs)
      mail_activity[convo_id].push({'convo_id':convo_id, 'event':my_received_mail_events[i], 'ipfs':ipfs_obj, 'type':'received', 'time':my_received_mail_events[i].returnValues.p6, 'convo_with':my_received_mail_events[i].returnValues.p2, 'sender':my_received_mail_events[i].returnValues.p2, 'recipient':my_received_mail_events[i].returnValues.p1})
    }
    this.setState({received_mail: {'received_mail':received_mail, 'mail_activity':mail_activity}})
    console.log('received mail count: '+created_mail.length)

    if(is_syncing){
      this.inc_synch_progress()
    }
    /* ---------------------------------------- ------------------------------------------- */
    /* ---------------------------------------- ------------------------------------------- */
    /* ---------------------------------------- ------------------------------------------- */
    /* ---------------------------------------- ------------------------------------------- */
  }


  store_data_in_infura = async (data) => {
    const projectId = '2RryKWCGNDlwzCa9yTG25TumLK4';
    const projectSecret = '494188d509a288e4df6da34864f6e141';
    // const auth = ''
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      apiPath: '/api/v0',
      headers: {
        authorization: auth,
      }
    })

    try {
      const added = await client.add(data)
      console.log('Stored string on IPFS with CID:', added.path.toString());

      return added.path.toString()
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }


  fetch_objects_data = async (id, web3) => {
    const E52contractArtifact = require('./contract_abis/E52.json');
    const E52_address = this.state.E35_addresses[1];
    const E52contractInstance = new web3.eth.Contract(E52contractArtifact.abi, E52_address);
    var target_id = id;
    var events = await E52contractInstance.getPastEvents('e5', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_obj_id */: target_id} }, (error, events) => {});
    if(events.length == 0) return;
    var cid = events[events.length - 1].returnValues.p4
    if(cid == 'e3') return;
    console.log('loaded events: ',events)

    const response = await this.fetch_objects_data_from_ipfs(cid)
    return response

  }

  fetch_objects_data_from_ipfs = async (cid) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      if (!response.ok) {
        throw new Error(`Failed to retrieve data from IPFS. Status: ${response}`);
      }
      const data = await response.text();
      return JSON.parse(data);
      // Do something with the retrieved data
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }



  get_balance_in_exchange = async (exchange_id, account) => {
      const web3 = new Web3(this.state.web3);
      const H52contractArtifact = require('./contract_abis/H52.json');
      const H52_address = this.state.E35_addresses[6];
      const H52contractInstance = new web3.eth.Contract(H52contractArtifact.abi, H52_address);
      
      var token_balances = await H52contractInstance.methods.f140e([exchange_id], account, [0]).call((error, result) => {});

      return token_balances[0]
  }







  encrypt_data = async () => {
    var address = await this.get_accounts_address(1002)
    console.log(address)

    const web3 = new Web3(this.state.web3);
    console.log(this.state.account)
    const privateKey = this.state.account.privateKey
    var hash = web3.utils.keccak256(privateKey.toString()).slice(34)

    // const pubKey = secp256k1.publicKeyCreate(Uint8Array.from(this.state.account.privateKey.slice(1)), false)
    // const publicKey = privateKeyToPublicKey(privateKey).toString('hex')
    
    var data = 'hello world'
    var private_key_to_use = Buffer.from(hash)
    const publicKeyA = await ecies.getPublic(private_key_to_use);
    // console.log(publicKeyA)
    
    const encrypted_data = (await ecies.encrypt(publicKeyA, Buffer.from(data)))
    // console.log(encrypted_data)
    var string = (new Uint8Array(encrypted_data)).toString()

    var uint8array = Uint8Array.from(string.split(',').map(x=>parseInt(x,10)));
    // console.log(uint8array)
    var plain_text = await ecies.decrypt(private_key_to_use, uint8array)
    // console.log(plain_text.toString())


    var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log(originalText)

    this.get_accounts_public_key(1002)
  }

  get_accounts_address = async (account_id) => {
    const web3 = new Web3(this.state.web3);
    const contractArtifact = require('./contract_abis/E5.json');
    const contractAddress = this.state.e5_address
    const contractInstance = new web3.eth.Contract(contractArtifact.abi, contractAddress);

    return await contractInstance.methods.f289(account_id).call((error, result) => {});
  }






  get_account_public_key = async () => {
    const web3 = new Web3(this.state.web3);
    const privateKey = this.state.account.privateKey
    var hash = web3.utils.keccak256(privateKey.toString()).slice(34)
    var private_key_to_use = Buffer.from(hash)
    const publicKeyA = await ecies.getPublic(private_key_to_use);
    var key = (new Uint8Array(publicKeyA)).toString()//oh my god

    var object_as_string = JSON.stringify({'key':key})
    var obj_cid = await this.store_data_in_infura(object_as_string)
    return obj_cid
  }

  get_account_raw_public_key = async () => {
    const web3 = new Web3(this.state.web3);
    const privateKey = this.state.account.privateKey
    var hash = web3.utils.keccak256(privateKey.toString()).slice(34)
    var private_key_to_use = Buffer.from(hash)
    const publicKeyA = await ecies.getPublic(private_key_to_use);
    return publicKeyA
  }

  encrypt_data_object(tx, key){
    var object_as_string = JSON.stringify(tx)
    var ciphertext = CryptoJS.AES.encrypt(object_as_string, key).toString();
    return ciphertext
  }

  get_accounts_public_key = async (account) => {
    const web3 = new Web3(this.state.web3);
    const E52contractArtifact = require('./contract_abis/E52.json');
    const E52_address = this.state.E35_addresses[1];
    const E52contractInstance = new web3.eth.Contract(E52contractArtifact.abi, E52_address);
    var events = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_id */: account, p3/* context */:'0'} }, (error, events) => {});

    var filtered_events = events;

    if(filtered_events.length == 0){
      return ''
    }

    var obj_key = await this.fetch_objects_data_from_ipfs(filtered_events[filtered_events.length-1].returnValues.p4)
    var uint8array = Uint8Array.from(obj_key['key'].split(',').map(x=>parseInt(x,10))); 
    return uint8array
  }

  encrypt_key_with_accounts_public_key_hash = async (key, pub_key_hash) => {
    const encrypted_data = (await ecies.encrypt(pub_key_hash, Buffer.from(key)))
    var string = (new Uint8Array(encrypted_data)).toString()
    return string
  }

  get_ipfs_object = async (encrypted_ipfs_obj) => {
    const web3 = new Web3(this.state.web3);
    const privateKey = this.state.account.privateKey
    var hash = web3.utils.keccak256(privateKey.toString()).slice(34)
    var private_key_to_use = Buffer.from(hash)

    if(encrypted_ipfs_obj['recipient_data'] == null){
      return null
    }
    var encrypted_key = encrypted_ipfs_obj['recipient_data'][this.state.user_account_id]
    var uint8array = Uint8Array.from(encrypted_key.split(',').map(x=>parseInt(x,10)));
  
    var my_key = await ecies.decrypt(private_key_to_use, uint8array)
    var encrypted_object = encrypted_ipfs_obj['obj']
    

    try{
      var bytes  = CryptoJS.AES.decrypt(encrypted_object, my_key.toString());
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(originalText);
    }catch(e){
      console.log(e)
      return null
    }
    
  }


  get_objects_messages = async (id) => {
    const web3 = new Web3(this.state.web3);
    const E52contractArtifact = require('./contract_abis/E52.json');
    const E52_address = this.state.E35_addresses[1];
    const E52contractInstance = new web3.eth.Contract(E52contractArtifact.abi, E52_address);

    var created_channel_data = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_id */: id } }, (error, events) => {});
    var messages = []
    for(var j=0; j<created_channel_data.length; j++){
      var ipfs_message = await this.fetch_objects_data_from_ipfs(created_channel_data[j].returnValues.p4)
      messages.push(ipfs_message)
    }
    
    var clone = JSON.parse(JSON.stringify(this.state.object_messages))
    clone[id] = messages
    this.setState({object_messages: clone})
  }

  get_job_objects_responses = async (id) =>{
    const web3 = new Web3(this.state.web3);
    const E52contractArtifact = require('./contract_abis/E52.json');
    const E52_address = this.state.E35_addresses[1];
    const E52contractInstance = new web3.eth.Contract(E52contractArtifact.abi, E52_address);

    var created_job_respnse_data = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_id */: id, p3/* context */:36 } }, (error, events) => {});

    var application_responses = await E52contractInstance.getPastEvents('e4', { fromBlock: 0, toBlock: 'latest', filter: { p1/* target_id */: id, p3/* context */:37 } }, (error, events) => {});

    var messages = []
    for(var j=0; j<created_job_respnse_data.length; j++){
      var ipfs_message = await this.fetch_objects_data_from_ipfs(created_job_respnse_data[j].returnValues.p4)
      ipfs_message['contract'] = this.state.created_contract_mapping[ipfs_message['picked_contract_id']]
      ipfs_message['id'] = created_job_respnse_data[j].returnValues.p5
      ipfs_message['job_id'] = id;


      var filtered_events = []
      for(var i=0; i<application_responses.length; i++){
        if(application_responses[i].returnValues.p5 == created_job_respnse_data[j].returnValues.p5){
          filtered_events.push(application_responses[i])
        }
      }
      if(filtered_events.length > 0){
        var last_response = filtered_events[filtered_events.length -1]
        var last_response_ipfs_obj = await this.fetch_objects_data_from_ipfs(last_response.returnValues.p4)
        console.log(last_response_ipfs_obj)
        ipfs_message['is_response_accepted'] = last_response_ipfs_obj['accepted'];
      }else{
        ipfs_message['is_response_accepted'] = false
      }

      messages.push(ipfs_message)
    }

    var clone = JSON.parse(JSON.stringify(this.state.job_responses))
    clone[id] = messages
    this.setState({job_responses: clone})

  }

}

export default App;
