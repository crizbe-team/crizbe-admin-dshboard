import React from 'react';
import PageBanner from '../../_components/PageBanner';
import Footer from '../../_components/Footer';

const PrivacyPolicyPage = () => {
    const sections = [
        {
            title: 'PRIVACY POLICY',
            content:
                'Lorem ipsum dolor sit amet consectetur. Nam eget nisi enim venenatis sapien. Mattis mi pellentesque sapien culac ac cursus a purus volutpat. Vel egestas fermentum sodales accumsan massa. Rhoncus gravida turpis morbi ut eget massa id enim vulputate.',
        },
        {
            title: 'PERSONAL IDENTIFICATION INFORMATION',
            content:
                'Lorem ipsum dolor sit amet consectetur. At ullamcorper risus porttitor aliquam et vitae et. Duis vitae enim metus turpis. Quis arcu ultrices vel sed at quis. In pulvinar lacus at sagittis commodo dignissim. Egestas amet tellus mollis nulla mi egestas risus. Et tristique ultrices consectetur amet. Pa trum in vestibulum nulla massa massa proin urna odio cras. Neque elementum vestibulum sed accumsan vehicula dignissim malesuada. Accumsan nunc diam id augue rutrum. Nullam sodales pellentesque neque malesuada ut ut morbi. Mauris non nec sed cursus egestas. Dui aliquet aliquam posuere non est ut nisl.',
        },
        {
            title: 'NON-PERSONAL IDENTIFICATION INFORMATION',
            content:
                'Lorem ipsum dolor sit amet consectetur. Volutpat sit enim suspendisse nunc neque massa pulvinar. Elementum tincidunt nuno enim mi. Est bibendum tempor risus in sit a. Feugiat amet nullam faucibus tempus door eleifend. Varius egestas mauris faucibus lacus nisl amet integer. Nam rutrum ac tempus purus odio ac dictum. Ut viverra nisl nisi hac tincidunt.',
        },
        {
            title: 'WEB BROWSER COOKIES',
            content:
                'Lorem ipsum dolor sit amet consectetur. Interdum placerat varius purus fames netus massa. Sed quam tortor et mi erat nibh volutpat turpis id. Felis et pulvinar molestie lobortis. Vitae posuere quam pellentesque est suspendisse elit felis bibendum odio. Ipsum massa nisl tellus at convallis penatibus. Lacus at imperdiet in laoreet volutpat sit donec. Feugiat leo.',
        },
        {
            title: 'HOW WE USE COLLECTED INFORMATION',
            content:
                'Lorem ipsum dolor sit amet consectetur. Mattis turpis duis faucibus commodo phasellus vive rra. Elementum pretium habitant tristique habitant. Arcu varius sed diam duis mattis aenean. Morbi nascetur euismod aliquet feugiat in molestie risus non eget. Vitae ornare magna sit ultricies arcu netus ornare. Proin euismod mus ultrices gravida malesuada sed tempus at. At semper etiam dui etiam consectetur diam vitae morbi. Imperdiet sed at nulla nulla que eu. Feugiat massa convallis orci ac nunc congue. Tristique pharetra elit congue et ullamcorper. Unididunt lorem felis. Aliquet scelerisque ut et elementum. In scelerisque velit phasellus amet nec lacus nullam dolor cras.\n\nEt euismod ultrices egestas sollicitudin. Turpis quis elit lectus in lacus pulvinar ligula amet sed. Fames dignissim magna lectus porta quisque scelerisque nullam. Nunc dapibus tellus lorem nisi lacus consequat. Diam non sum non nam sed ultrices. Vel pharetra lobortis integer curabitur nec. Sed dolor morbi nibh eget massa pellentesque nisl nulla.\n\nSagittis feugiat lobortis dapibus venenatis hendrerit est arcu ultrices. Vivamus fermentum commodo eleifend porta mattis viverra fames. Scelerisque nibh adipiscing elementum libero velit. In egestas ut et nunc sit pharetra tellus lacus nunc. Risus amet pellentesque neque lacus risus eros fermentum. Viverra pellentesque ultrices ipsum nisl consequat quis. At ut nunc sit ut arcu suscipit in diam. Aliquam magna eu tellus ipsum mi ullamcorper gravida. Molestie et vestibulum donec nisl et ante id amet.\n\nMetus viverra nunc pellentesque lectus mauris lorem morbi id quam. Massa posuere mattis semper sed. Enim adipiscing.',
        },
        {
            title: 'HOW WE PROTECT YOUR INFORMATION',
            content:
                'Lorem ipsum dolor sit amet consectetur. In ornare hendrerit diam facilisis sed. Bibendum ante quam dignissim venenatis posuere eu habitasse. Tortor pulvinar suspendisse viverra neque. Arcu massa quis leo id. Id tristique pharetra id erat lacus morbi neque sed feugiat. Velit tempor eget morbi sed aliquam eleifend. Duis platea in nibh sed nulla. Interdum vitae id varius augue id egestas sed. Sed viverra sapien pretium cursus est in lectus mattis.\n\nDiam blandit nulla neque dictum lacus bibendum sed. Duis nam fermentum id quisque sed lobortis et erat vitae. Feugiat viverra volutpat egestas diam facilisis etiam arcu. Et euismod sit odio tortor placerat sapien turpis tortor nec aliquam vel.',
        },
        {
            title: 'SHARING YOUR PERSONAL INFORMATION',
            content:
                'Lorem ipsum dolor sit amet consectetur. Convallis pharetra auctor sapien nunc sed sed in lectus sed. Sit odio at sit diam nibh ultrices malesuada urna. At convallis mi vitae vivamus ac viverra enim nibh. Arcu lectus tellus elit rutrum vehicula porttitor ut mi. Nibh imperdiet non sed feugiat tellus quis. Gravida tortor pharetra pellentesque pellentesque.\n\nInterdum a mauris maecenas elementum phasellus sit. Mi vitae donec ac ac vitae elit tincidunt vitae viverra. Eget gravida lectus tellus tempor viverra faucibus. Rhoncus tempor enim semper id quis netus non urna risus. Praesent ac dolor dolor neque.',
        },
        {
            title: 'THIRD-PARTY WEBSITES',
            content:
                'Lorem ipsum dolor sit amet consectetur. Adipiscing sem ut mi velit viverra bibendum. Arcu massa fermentum neque mauris viverra. Id donec nulla nullam dolor dignissim ac dolor. Nibh blandit sed faucibus non. Massa ornare viverra pharetra mattis sit. Pellentesque iaculis nisi risus volutpat malesuada elit fringilla et ligula. Pretium rhoncus in quam viverra pharetra.\n\nPulvinar id adipiscing platea ut nascetur malesuada purus ac. Non quis nunc eu mauris lectus viverra dui aliquam. Mi sed iaculis ac semper. Tortor sem consectetur libero ipsum. Eleifend aliquet sagittis ac vestibulum tellus feugiat libero.',
        },
        {
            title: 'CHANGES TO THIS PRIVACY POLICY',
            content:
                'Lorem ipsum dolor sit amet consectetur. Etiam leo tempor non augue. Libero proin egestas duis pellentesque lacinia in ornare dolor. Sapien feugiat dolor et senectus cursus aliquam. Duis rutrum neque vulputate sit eget porttitor ut at. Cras lectus vehicula nibh nunc scelerisque amet. Et nibh quam viverra sed in. Adipiscing eu iaculis ullamcorper in aenean ante ultricies massa ultrices. Condimentum adipiscing consectetur ut turpis euismod et. Faucibus volutpat viverra feugiat.',
        },
        {
            title: 'YOUR ACCEPTANCE OF THESE TERMS',
            content:
                'Lorem ipsum dolor sit amet consectetur. Sed auctor ac duis tortor sollicitudin metus est blandit. Cu ut turpis sed enim quam amet elit erat. Praesent a sit et purus at ipsum et. Eu imperdiet pellentesque erat rhoncus posuere ut faucibus enim rhoncus. Lacus rutrum faucibus quis hendrerit. Cursus massa tristique orci in tellus duis feugiat aenean odio. Volutpat.',
        },
        {
            title: 'CONTACTING US',
            content:
                'If you have any questions about this Privacy Policy, the practices of this Site, or your dealings with this Site, please contact us at: Crizbe Pvt Ltd',
            contact: {
                phone: '983232991',
                email: 'Email',
                location: 'Location',
            },
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            <PageBanner
                title="Privacy Policy"
                subtitle="We value your privacy and are committed to protecting your personal data."
            />

            <main className="wrapper py-16 md:py-24">
                <div className="space-y-12 max-w-5xl mx-auto">
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[#191919] uppercase tracking-wide">
                                {section.title}
                            </h2>
                            <p className="text-[#474747] leading-relaxed text-base md:text-lg whitespace-pre-line text-justify">
                                {section.content}
                            </p>
                            {section.contact && (
                                <div className="mt-4 space-y-2 text-[#474747] text-base md:text-lg">
                                    <p>
                                        <span className="font-semibold">Phone:</span>{' '}
                                        {section.contact.phone}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email:</span>{' '}
                                        {section.contact.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Location:</span>{' '}
                                        {section.contact.location}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
