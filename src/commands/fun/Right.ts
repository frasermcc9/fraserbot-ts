import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import { stringify } from "querystring";

export default class Right extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "right",
            group: "fun",
            memberName: "right",
            description: "If you have an argument, find who's right",
            args: [
                {
                    key: "member",
                    prompt: "Mention the person you have an argument with",
                    type: "member",
                },]
        });
    }

    async run(message: CommandoMessage,{ member }: { member: GuildMember }): Promise<Message> {        
        const num = Math.random();
        let user: string;
        if(message.author.id == "526559520428654592" || member.id == "526559520428654592"){
            user = "526559520428654592";
        }
        else if (message.author.id == "357675387678883840" || member.id == "357675387678883840"){
            return message.channel.send("Acir is always wrong");
        }
        else{
            if ( num >= 0.5){
                user = message.author.id;
            }
            else{
                user = member.id;
            }
        }
    
         return message.channel.send(`${user} wins the argument cuz they're smarter`);
    }
}