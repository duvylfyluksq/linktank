import Image from "next/image";
import Link from "next/link";

export default function OrganizationContainer({org}: {org: Organization}){
    return(
        <Link href={org.url} key={org._id} target="_blank" rel="noopener noreferrer">
            <div
                key={org._id}
                className="border border-[#D3D0D0] bg-white rounded-[10px] shadow-sm
    flex flex-col justify-center items-start
    pr-[40px] pl-[19px] py-8 w-auto h-auto gap-[0.5rem] transition-shadow duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300"
            >
                <div className="flex items-center gap-4">
                        {org.logo_url ? (
                            <div className="w-20 h-16 bg-gray-200 rounded flex flex-col items-center justify-center flex-shrink-0">
                                <Image
                                    src={org.logo_url}
                                    alt={`${org.name} logo`}
                                    width={100}
                                    height={100}
                                    className="w-auto h-14 object-contain rounded"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded" />
                        )}
                        <h2 className="text-xl font-semibold text-[#323232]">
                            {org.name}
                        </h2>
                </div>
            </div>
        </Link>
    );
}