import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import {
    ChevronUp,
    CircleUserRound,
    Crown,
    LogIn,
    LogOut,
    Play,
    Settings,
    Swords,
    Timer,
    UsersRound,
} from 'lucide-react';

import { uiText } from '../../app-state';

import './MenuScreen.css';

type MenuScreenProps = {
    toastMessage: string | undefined;
    toastId: number;
    onOpenAuth: () => void;
    onOpenAccount: () => void;
    onOpenFriends: () => void;
    onOpenLeaderboard: () => void;
    onOpenSolo: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenBattle: () => void;
    onOpenTutorial?: () => void;
    onLogout: () => void;
    isGuest: boolean;
    needsTutorial?: boolean;
    playerName: string;
    userEmail?: string;
};

export function MenuScreen({
    toastMessage,
    toastId,
    onOpenAuth,
    onOpenAccount,
    onOpenFriends,
    onOpenLeaderboard,
    onOpenSolo,
    onOpenBattle,
    onOpenTutorial,
    onLogout,
    isGuest,
    needsTutorial,
    playerName,
    userEmail,
}: MenuScreenProps): JSX.Element {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [clickedMode, setClickedMode] = useState<string | undefined>(
        undefined
    );
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [visibleToast, setVisibleToast] = useState<string | undefined>(
        undefined
    );
    const toastTimeoutRef = useRef<
        ReturnType<typeof globalThis.setTimeout> | undefined
    >(undefined);

    useEffect(() => {
        if (!toastMessage) {
            return undefined;
        }

        showMenuToast(toastMessage);
        return undefined;
    }, [toastId, toastMessage]);

    useEffect(
        () => () => {
            if (toastTimeoutRef.current !== undefined) {
                globalThis.clearTimeout(toastTimeoutRef.current);
            }
        },
        []
    );

    useEffect(() => {
        if (!profileMenuOpen) {
            return undefined;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setProfileMenuOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setProfileMenuOpen(false);
            }
        }

        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [profileMenuOpen]);

    function showMenuToast(message: string) {
        if (toastTimeoutRef.current !== undefined) {
            globalThis.clearTimeout(toastTimeoutRef.current);
        }

        setVisibleToast(message);
        toastTimeoutRef.current = globalThis.setTimeout(
            (nextValue: undefined) => {
                setVisibleToast(nextValue);
                toastTimeoutRef.current = undefined;
            },
            2200,
            undefined
        );
    }

    return (
        <main className='app-shell fullscreen-shell'>
            <section className='screen screen-menu'>
                <div className='menu-layout'>
                    <div aria-label='Version' className='menu-version-label'>
                        {uiText.versionLabel}
                    </div>
                    {!needsTutorial && (
                        <div className='profile-menu' ref={profileMenuRef}>
                            <button
                                aria-expanded={profileMenuOpen}
                                aria-label={uiText.accountTitle}
                                className='profile-menu-toggle'
                                onClick={() => {
                                    setProfileMenuOpen((prev) => !prev);
                                }}
                                type='button'
                            >
                                <CircleUserRound
                                    className={`profile-menu-icon profile-menu-icon-user${
                                        profileMenuOpen
                                            ? ' profile-menu-icon-hidden'
                                            : ''
                                    }`}
                                    size={22}
                                />
                                <ChevronUp
                                    className={`profile-menu-icon profile-menu-icon-chevron${
                                        profileMenuOpen
                                            ? ''
                                            : ' profile-menu-icon-hidden'
                                    }`}
                                    size={22}
                                />
                            </button>
                            <div
                                className={`profile-menu-dropdown${
                                    profileMenuOpen
                                        ? ' profile-menu-dropdown-open'
                                        : ''
                                }`}
                            >
                                {isGuest ? (
                                    <button
                                        className='profile-menu-action'
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            onOpenAuth();
                                        }}
                                        type='button'
                                    >
                                        <LogIn size={20} />
                                        <span>{uiText.signIn}</span>
                                    </button>
                                ) : (
                                    <div className='profile-menu-identity'>
                                        <span className='profile-menu-label'>
                                            {uiText.email}
                                        </span>
                                        <span className='profile-menu-email'>
                                            {userEmail ?? playerName}
                                        </span>
                                    </div>
                                )}

                                {isGuest ? undefined : (
                                    <>
                                        <button
                                            className='profile-menu-action'
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onOpenAccount();
                                            }}
                                            type='button'
                                        >
                                            <Settings size={20} />
                                            <span>{uiText.settings}</span>
                                        </button>
                                        <button
                                            className='profile-menu-action'
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onOpenFriends();
                                            }}
                                            type='button'
                                        >
                                            <UsersRound size={20} />
                                            <span>{uiText.friendsTitle}</span>
                                        </button>
                                    </>
                                )}

                                <button
                                    className='profile-menu-action'
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        onOpenLeaderboard();
                                    }}
                                    type='button'
                                >
                                    <Crown size={20} />
                                    <span>{uiText.leaderboardTitle}</span>
                                </button>

                                {isGuest ? undefined : (
                                    <button
                                        className='profile-menu-action profile-menu-action-danger'
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            onLogout();
                                        }}
                                        type='button'
                                    >
                                        <LogOut size={20} />
                                        <span>{uiText.logout}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className='menu-title-orb' />
                    <h1 className='hero-title'>
                        <span>{uiText.titleLead}</span>
                        <span
                            aria-hidden='true'
                            className='hero-title-filled-o'
                        />
                        <span>{uiText.titleTail}</span>
                    </h1>

                    <div className='menu-content'>
                        {needsTutorial ? (
                            <div className='menu-mode-cards'>
                                <button
                                    className={`mode-card mode-card-tutorial${
                                        clickedMode === 'tutorial'
                                            ? ' mode-card-clicked'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setClickedMode('tutorial');
                                        if (onOpenTutorial) {
                                            onOpenTutorial();
                                        }
                                    }}
                                    type='button'
                                >
                                    <div className='mode-card-blob'>
                                        <Play
                                            aria-hidden='true'
                                            className='mode-card-icon'
                                        />
                                        <span className='mode-card-title'>
                                            {uiText.menuPlay}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className='menu-mode-cards'>
                                <button
                                    className={`mode-card mode-card-solo${
                                        clickedMode === 'solo'
                                            ? ' mode-card-clicked'
                                            : ''
                                    }`}
                                    onClick={(e) => {
                                        setClickedMode('solo');
                                        onOpenSolo(e);
                                    }}
                                    type='button'
                                >
                                    <div className='mode-card-blob'>
                                        <Timer
                                            aria-hidden='true'
                                            className='mode-card-icon'
                                        />
                                        <span className='mode-card-title'>
                                            {uiText.soloTitle}
                                        </span>
                                    </div>
                                </button>
                                <button
                                    className={`mode-card mode-card-battle${
                                        clickedMode === 'battle'
                                            ? ' mode-card-clicked'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setClickedMode('battle');
                                        onOpenBattle();
                                    }}
                                    type='button'
                                >
                                    <div className='mode-card-blob'>
                                        <Swords
                                            aria-hidden='true'
                                            className='mode-card-icon'
                                        />
                                        <span className='mode-card-title'>
                                            {uiText.battleTitle}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {visibleToast ? (
                    <div aria-live='polite' className='menu-toast-layer'>
                        <div className='menu-toast'>{visibleToast}</div>
                    </div>
                ) : undefined}
            </section>
        </main>
    );
}
