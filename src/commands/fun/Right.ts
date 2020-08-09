import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import { stringify } from "querystring";

export default class LennyCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "right",
            group: "fun",
            memberName: "right",
            description: "If you have an argument, find who's right",
            args: [
                {
                    key: "member",
                    prompt: "Who should be kicked?",
                    type: "member",
                },]
        });
    }

    async run(message: CommandoMessage,{ member }: { member: GuildMember }): Promise<Message> {        
        const num = Math.random();
        let user: string;
        if(message.author.id == "<@526559520428654592>" || message.mentions.users.first().id == "<@526559520428654592>"){
            user = "<@526559520428654592>";
        }
        else{
            if (num){
                user = message.author.id;
            }
            else{
                user = member.displayName;
            }
        }
    
         return message.channel.send(`${user} wins the argument cuz they're smarter`);
    }
}