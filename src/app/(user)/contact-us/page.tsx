'use client';

import React from 'react';
import PageBanner from '../../_components/PageBanner';
import Footer from '../../_components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/validations/contact';
import { useSubmitContactForm } from '@/queries/use-contact';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { toast } from '@/components/ui/Toast';

export default function ContactUsPage() {
    const { mutate: submitForm, isPending } = useSubmitContactForm();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            phone_country_code: '+91',
            location: '',
            message: '',
        },
    });

    const onSubmit = (data: ContactFormData) => {
        submitForm(data, {
            onSuccess: (response) => {
                toast.success('Thank you for contacting us! We will get back to you soon.');
                reset();
            },
            onError: (error: any) => {
                toast.error(
                    error.message || 'Failed to submit the form. Please check your connection.'
                );
            },
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <PageBanner
                title="Help"
                subtitle="We're here to assist you with any questions or concerns."
                showWatermark={true}
            />

            <main className="relative -mt-10 z-10">
                <div className="">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] px-6 md:px-[150px] lg:px-[300px] py-16 md:py-[120px]"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <FormInput
                                    label="Name *"
                                    placeholder="Enter your name"
                                    className="h-[42px] rounded-[10px] border-gray-100"
                                    {...register('name')}
                                    error={errors.name?.message}
                                />
                                <FormInput
                                    label="Email id"
                                    type="email"
                                    placeholder="Enter email id"
                                    className="h-[42px] rounded-[10px] border-gray-100"
                                    {...register('email')}
                                    error={errors.email?.message}
                                />
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneInput
                                            {...field}
                                            label="Phone number"
                                            required
                                            enableCodeSelect
                                            selectedCode={watch('phone_country_code')}
                                            onCodeChange={(code) =>
                                                setValue('phone_country_code', code)
                                            }
                                            enableCodeSearch
                                            codeSearchPlaceholder="Search country code..."
                                            placeholder="000 0000 000"
                                            className="rounded-[10px] border-gray-100"
                                            error={errors.phone_number?.message}
                                        />
                                    )}
                                />
                                <FormInput
                                    label="Location"
                                    placeholder="Enter your location"
                                    className="h-[42px] rounded-[10px] border-gray-100"
                                    {...register('location')}
                                    error={errors.location?.message}
                                />
                            </div>

                            <FormTextarea
                                label="Message"
                                placeholder="Enter your message"
                                rows={6}
                                className="rounded-2xl border-gray-100 p-6"
                                {...register('message')}
                                error={errors.message?.message}
                            />

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-[42px] px-12 rounded-[10px] bg-[#D6A960] hover:bg-[#C4994A] text-white font-semibold transition-all shadow-lg hover:shadow-[#D6A960]/20 disabled:opacity-50"
                                >
                                    {isPending ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24 pb-10">
                            {/* Address Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-start gap-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#F9F2E0] flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-[#C4994A]" />
                                    </div>
                                    <span className="font-bold text-[#191919]">Address</span>
                                </div>
                                <p className="text-[#474747] text-sm leading-relaxed">
                                    Office No: 7, 4th Floor Al Naboodah
                                    <br />
                                    Al Shoala Building, Port Saeed,
                                    <br />
                                    Deira, PO Box: 31923 Dubai, UAE
                                </p>
                                <button className="mt-auto px-6 py-2 rounded-full border border-gray-200 text-sm font-semibold text-[#191919] hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                    <span className="w-4 h-4 rounded-full bg-[#C4994A]/10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#C4994A]" />
                                    </span>
                                    Get direction
                                </button>
                            </motion.div>

                            {/* Contact Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-start gap-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#F9F2E0] flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-[#C4994A]" />
                                    </div>
                                    <span className="font-bold text-[#191919]">Contact</span>
                                </div>
                                <div className="text-[#474747] text-sm space-y-1">
                                    <p>+91 9109 622 697</p>
                                    <p>+91 9109 622 698</p>
                                </div>
                                <button className="mt-auto px-6 py-2 rounded-full border border-gray-200 text-sm font-semibold text-[#191919] hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                    <span className="w-4 h-4 rounded-full bg-[#C4994A]/10 flex items-center justify-center">
                                        <Phone className="w-3 h-3 text-[#C4994A]" />
                                    </span>
                                    Request a call
                                </button>
                            </motion.div>

                            {/* Email Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-start gap-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#F9F2E0] flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-[#C4994A]" />
                                    </div>
                                    <span className="font-bold text-[#191919]">Email</span>
                                </div>
                                <p className="text-[#474747] text-sm">support@crizbe.com</p>
                                <button className="mt-auto px-6 py-2 rounded-full border border-gray-200 text-sm font-semibold text-[#191919] hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                    <Mail className="w-4 h-4 text-[#C4994A]" />
                                    Mail now
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
