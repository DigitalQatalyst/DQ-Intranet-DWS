import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import {
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Calendar,
    Clock,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { PageLayout, PageSection, SectionContent } from '../../../components/PageLayout';
import { getOnboardingData } from '../../../services/employeeOnboardingService';

const ProfilePage: React.FC = () => {
    const { accounts } = useMsal();
    const account = accounts[0];
    const [onboardingData, setOnboardingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const employeeId = account?.localAccountId || account?.username || "";

    useEffect(() => {
        const loadEmployeeData = async () => {
            if (!employeeId) return;
            setLoading(true);
            try {
                const data = await getOnboardingData(employeeId);
                setOnboardingData(data);
            } catch (error) {
                console.error("Error loading employee profile:", error);
            } finally {
                setLoading(false);
            }
        };

        loadEmployeeData();
    }, [employeeId]);

    if (loading) {
        return (
            <PageLayout title="Employee Profile">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Employee Profile">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Profile Card */}
                <PageSection className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    <SectionContent className="relative pt-0">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-3xl border border-blue-100">
                                    {account?.name?.charAt(0) || <User size={40} />}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 pb-1">
                                <h1 className="text-2xl font-bold text-gray-900 truncate">
                                    {account?.name || "Employee Name"}
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {onboardingData?.role || onboardingData?.industry || "Role not specified"}
                                </p>
                            </div>
                            <div className="flex gap-2 pb-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Onboarded
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-gray-100">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="text-sm font-medium">{account?.username || "Not available"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="text-sm font-medium">{onboardingData?.phone || "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Employment Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Organization</p>
                                            <p className="text-sm font-medium">{onboardingData?.tradeName || "DigitalQatalyst"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Joined Date</p>
                                            <p className="text-sm font-medium">Jan 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionContent>
                </PageSection>

                {/* Additional Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PageSection className="col-span-1 md:col-span-2">
                        <SectionContent>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-blue-600" size={20} />
                                Professional Summary
                            </h3>
                            <div className="prose prose-sm text-gray-600 max-w-none">
                                {onboardingData?.professionalSummary ? (
                                    <p>{onboardingData.professionalSummary}</p>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 italic">
                                        <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                                        No professional summary found. Complete your onboarding journey to fill this in.
                                    </div>
                                )}
                            </div>
                        </SectionContent>
                    </PageSection>

                    <div className="space-y-6">
                        <PageSection>
                            <SectionContent>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="text-blue-600" size={16} />
                                    System Stats
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Profile Completion</span>
                                            <span className="font-bold text-blue-600">85%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Onboarding Status</span>
                                            <span className="font-bold text-green-600">Complete</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </SectionContent>
                        </PageSection>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ProfilePage;
