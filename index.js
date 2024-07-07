const { Client, Intents, MessageActionRow, MessageSelectMenu  , MessageButton , MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = '-';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});







    let Color = '#0099ff'; // يمكنك تغيير اللون هنا
    let categoryId = '1255848481076285482'; // ايدي الكاتيجوري الذي سيتم فتح التيكت فيه
    let requiredRole1 = '1256377692325150800'; // ايدي الرتبة الاولى
  
    let idbank = '1256449775054618649'; // ايدي البنك
    let idprobot = '282859044593598464'; // ايدي بروبوت
    let ServerCopyPriceQ = 1; // سعر نسخ السيرفر
    let urlChannelID = '1256339363839606906'; // ايدي الروم الذي سيتم ارسال الرابط فيه
    const ggg = Math.floor(ServerCopyPriceQ * (20 / 19) + 1);














client.on('messageCreate', message => {
    if(message.content.startsWith(PREFIX + 'setup')){


        let embed = new MessageEmbed()
        .setTitle('نسخ سيرفرات')
        .setDescription('اضغط على الزر لنسخ السيرفر')
        .setColor(Color)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary')
                .setLabel('نسخ السيرفر')
                .setStyle('SUCCESS'),
        );

        message.channel.send({ embeds: [embed], components: [row] });

    }
     
        
  
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const guild = interaction.guild;
    if (interaction.customId === 'primary') {
        let channelOptions = {
            type: 'GUILD_TEXT',
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: requiredRole1, 
                    allow: ['VIEW_CHANNEL'],
                },

            ],
        };

        let channelName, embedMessage, components;

        channelName = `Support-${interaction.user.username}`;
                embedMessage = new MessageEmbed()
                    .setColor(Color)
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(`**اهلا بك في سيرفر**`)
                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('copy_server')
                            .setLabel('نسخ السيرفر')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('QS')
                            .setLabel('اسئلة شائعة')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('come')
                            .setLabel('استدعاء العضو')
                            .setStyle('SECONDARY'),



                    ),
                ]



                await interaction.reply({ content: 'جاري انشاء التكت .......', ephemeral: true });

                guild.channels.create(channelName, channelOptions).then(async channel => {

                    interaction.editReply({ content: `**تم فتح تذكرتك : ${channel}**`, ephemeral: true });
                    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embedMessage], components: components });
              
                });



    }   
});






client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'copy_server') {
        copyServer(interaction, ServerCopyPriceQ);
    } else if (interaction.customId === 'QS') {
        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('اختر السؤال')
                    .addOptions([
                        {
                            label: 'هل يحتاج توكن حسابي لنسخ؟',
                            value: '1'
                        },
                        {
                            label: 'هل يمكنني نسخ أي سيرفر أريده حتى لو كان كبير؟',
                            value: '2'
                        },
                        {
                            label: 'هل يتم نسخ جميع الرتب؟',
                            value: '3'
                        }
                    ])
            );
        
        interaction.reply({ content: 'اختر السؤال', components: [row], ephemeral: true });
    } else if (interaction.customId === 'come') { 
        interaction.reply({ content: 'تم استدعاء العضو', ephemeral: true });

        let channel = interaction.channel;

        try {
            await channel.guild.members.fetch({ time: 60000 });

            const membersWithoutRoleOrAdmin = channel.guild.members.cache.filter(member => {
                return !member.roles.cache.has(requiredRole1) && !member.permissions.has('ADMINISTRATOR');
            });

            membersWithoutRoleOrAdmin.forEach(async member => {
                try {
                    const embed = new MessageEmbed()
                        .setColor('#000100')
                        .setDescription(`**مرحبا ${member} تم استدعائك من قبل <@${interaction.user.id}>, اضغط علي الزر بالاسفل**`)
                        .setAuthor({
                            name: member.guild.name,
                            iconURL: member.guild.iconURL()
                        })
                        .setFooter({
                            text: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setThumbnail(member.guild.iconURL())
                        .setTimestamp();
                    
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setURL(`https://discord.com/channels/${member.guild.id}/${interaction.channel.id}`)
                                .setLabel('Go to Channel')
                                .setStyle('LINK')
                        );

                    await member.send({ 
                        embeds: [embed],
                        components: [row]
                    });

                    console.log(`Message sent to ${member.user.tag}`);
                } catch (error) {
                    console.log(`Failed to send message to ${member.user.tag}: ${error}`);
                }
            });
        } catch (error) {
            console.log(`Failed to fetch members: ${error}`);
        }
    }
});




client.on('interactionCreate', async interaction => {

    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
        const selected = interaction.values[0];
        if (selected === '1') {
            interaction.reply({ content: 'لا يحتاج الي توكن حساب', ephemeral: true });
        } else if (selected === '2') {
            interaction.reply({ content: 'نعم ولكن تحتاج الي وقت', ephemeral: true });
        } else if (selected === '3') {
            interaction.reply({ content: 'نعم وبكل سهولة', ephemeral: true });
        }
    }
})






async function copyServer(interaction , ServerCopyPrice) {
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);

    const tax = Math.floor(ServerCopyPrice * (20 / 19) + 1);



    const embedMessage = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setFooter(interaction.guild.name, interaction.guild.iconURL())
        .setTitle(`عملية نسخ السيرفر`)
        .setDescription(`قم بالتحويل ل <@${idbank}>\n\n\`\`\`js\n#credit ${idbank} ${tax}\n\`\`\``)
        .setColor(Color)

    const components = [
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`copy2:${ServerCopyPrice}`)
                .setLabel('نسخ التحويل ')
                .setStyle('SECONDARY')
        )
    ];

    await interaction.update({ embeds: [embedMessage], components });

    const filter = (response) => 
        response.content.includes(`has transferred \`$${ServerCopyPrice}\` to <@!${idbank}>`) &&
        response.author.id === idprobot;

    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
    });

    collector.on("collect", async (response) => {
        embedMessage.setDescription(`
            تم تأكيد التحويل سيقوم احد المشرفين بالتواصل معك قريباً
            
                \n \n 
        
                قم بي ادخال رابط السيرفر الذي تريد نسخه عن طريق الضغط على الزر
            
 
 
            `);

            const components = [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`modal1`)
                        .setLabel('رابط السيرفر')
                        .setStyle('SECONDARY')
                )
            ];



        await interaction.editReply({ embeds: [embedMessage], components: components });


        collector.stop();
    });

    collector.on("end", async (collected) => {
        if (collected.size === 0) {
            embedMessage.setDescription(`لقد انتهى الوقت، لا تقم بالتحويل  ${interaction.user}`);
            await interaction.editReply({ embeds: [embedMessage], components: [] });
        }
    });
}


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'modal1') {
 


        const modal = new Modal()
            .setCustomId('server_link')
            .setTitle('رابط السيرفر');

        const server_link = new TextInputComponent()
            .setCustomId('serverUrl')
            .setPlaceholder('رابط السيرفر')
            .setLabel('رابط السيرفر')
            .setStyle('SHORT');

        const firstRow = new MessageActionRow().addComponents(server_link);
        modal.addComponents(firstRow);

        
       
        await interaction.showModal(modal);

        
       
    }
});



client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit() && interaction.customId === 'server_link') {
    const serverUrl = interaction.fields.getTextInputValue('serverUrl');

    interaction.reply(`تم ارسال الرابط  للمشرفين للتحقق منه`)
    
    let embed = new MessageEmbed()
    .setColor(Color)
    .setTitle('رابط السيرفر')
    .addFields(
        { name: 'رابط السيرفر', value: serverUrl, inline: true },
        { name: 'المرسل', value: interaction.user.id, inline: true },
        { name: 'تاريخ الارسال', value: new Date().toLocaleDateString(), inline: true }
        
    )
    .setThumbnail(interaction.guild.iconURL())
    .setTimestamp()


    let row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('accept')
            .setLabel('ارسال الرابط للعميل')
            .setStyle('SUCCESS'),
    )
    

    let urlChannel = client.channels.cache.get(urlChannelID)

    urlChannel.send({ embeds: [embed] , components: [row] })
}
})


client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === 'accept') {
        const modal = new Modal()
            .setCustomId('NewServerLink')
            .setTitle('رابط السيرفر');

        const newServerLink = new TextInputComponent()
            .setCustomId('hhh') 
            .setPlaceholder('رابط السيرفر')
            .setLabel('رابط السيرفر')
            .setStyle('SHORT');

        const userId = new TextInputComponent()
            .setCustomId('userid') 
            .setPlaceholder('ايدي اليوزر')
            .setLabel('ايدي اليوزر')
            .setStyle('SHORT');

        const firstRow = new MessageActionRow().addComponents(newServerLink);
        const secondRow = new MessageActionRow().addComponents(userId);

        modal.addComponents(firstRow, secondRow);

    
        await interaction.showModal(modal);
    } 
});

client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit() && interaction.customId === 'NewServerLink') {
        try {
            const newServerUrl2 = interaction.fields.getTextInputValue('hhh'); // Adjust the field ID
            const userid = interaction.fields.getTextInputValue('userid'); 

            const user = await client.users.fetch(userid);

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('رابط السيرفر')
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setDescription(`رابط السيرفر الجديد: ${newServerUrl2}`)
                .addField('المرسل', `<@${interaction.user.id}>`)
                .addField('المستقبل', `<@${userid}>`)
                .addField('تاريخ الارسال', new Date().toLocaleDateString());

            await user.send({ embeds: [embed] });

            await interaction.reply({ content: 'تم ارسال الرابط للعميل', ephemeral: true });
        } catch (error) {
            console.error(`Error sending message to user: ${error}`);
            await interaction.reply({ content: 'حدث خطأ أثناء إرسال الرابط للعميل', ephemeral: true });
        }
    }
});




client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId.startsWith('copy2')) {
        const [ServerCopyPrice ] = interaction.customId.split(':');
        const price = parseInt(ServerCopyPrice, 10); 
        const tax = Math.floor(price * (20 / 19) + 1);
        await interaction.reply({ content: `#credit ${idbank} ${ggg}`, ephemeral: true });
    }
});






























client.login(''); // التوكن هنا